import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { z } from "zod";

const SubmitSchema = z.object({
  projectId: z.string().min(1),
  githubUrl: z.string().url(),
  description: z.string().optional(),
});

/** POST /api/submissions — student submits a project */
export async function POST(req: NextRequest) {
  const token = req.cookies.get("tc_session")?.value;
  if (!token) return NextResponse.json({ message: "Unauthorised" }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload || payload.role !== "STUDENT") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const data = SubmitSchema.parse(body);

    const student = await prisma.studentProfile.findUnique({
      where: { userId: payload.id },
    });
    if (!student) return NextResponse.json({ message: "Student profile not found" }, { status: 404 });

    // Check for duplicate submission
    const existing = await prisma.projectSubmission.findFirst({
      where: { studentId: student.id, projectId: data.projectId },
    });
    if (existing) {
      return NextResponse.json(
        { message: "You already submitted this project" },
        { status: 400 }
      );
    }

    const submission = await prisma.projectSubmission.create({
      data: {
        studentId: student.id,
        projectId: data.projectId,
        githubUrl: data.githubUrl,
        description: data.description ?? null,
        status: "PENDING",
      },
      include: { project: true },
    });

    return NextResponse.json({ submission }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ message: err.errors[0].message }, { status: 422 });
    }
    console.error("[SUBMISSIONS_POST]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

/** GET /api/submissions — get current student's submissions */
export async function GET(req: NextRequest) {
  const token = req.cookies.get("tc_session")?.value;
  if (!token) return NextResponse.json({ message: "Unauthorised" }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload || payload.role !== "STUDENT") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const student = await prisma.studentProfile.findUnique({
      where: { userId: payload.id },
    });
    if (!student) return NextResponse.json({ submissions: [] });

    const submissions = await prisma.projectSubmission.findMany({
      where: { studentId: student.id },
      include: { project: { include: { roadmap: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ submissions });
  } catch (err) {
    console.error("[SUBMISSIONS_GET]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
