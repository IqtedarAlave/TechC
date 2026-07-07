import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

/** POST /api/jobs/[id]/apply */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = req.cookies.get("tc_session")?.value;
  if (!token) return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  const payload = await verifyToken(token);
  if (!payload || payload.role !== "STUDENT") {
    return NextResponse.json({ message: "Only students can apply" }, { status: 403 });
  }

  try {
    const { coverNote } = await req.json() as { coverNote?: string };

    const student = await prisma.studentProfile.findUnique({
      where: { userId: payload.id },
    });
    if (!student) return NextResponse.json({ message: "Student profile not found" }, { status: 404 });

    // Check job exists and is active
    const job = await prisma.job.findUnique({ where: { id: params.id } });
    if (!job || !job.isActive) {
      return NextResponse.json({ message: "Job listing is not available" }, { status: 404 });
    }

    // Prevent duplicate applications
    const existing = await prisma.jobApplication.findUnique({
      where: { jobId_studentId: { jobId: params.id, studentId: student.id } },
    });
    if (existing) {
      return NextResponse.json({ message: "You already applied to this job" }, { status: 400 });
    }

    const application = await prisma.jobApplication.create({
      data: {
        jobId:     params.id,
        studentId: student.id,
        coverNote: coverNote ?? null,
        status:    "APPLIED",
      },
    });

    return NextResponse.json({ application }, { status: 201 });
  } catch (err) {
    console.error("[JOB_APPLY]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

/** GET /api/jobs/[id]/apply — check if current student already applied */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = req.cookies.get("tc_session")?.value;
  if (!token) return NextResponse.json({ applied: false });
  const payload = await verifyToken(token);
  if (!payload || payload.role !== "STUDENT") return NextResponse.json({ applied: false });

  try {
    const student = await prisma.studentProfile.findUnique({ where: { userId: payload.id } });
    if (!student) return NextResponse.json({ applied: false });

    const application = await prisma.jobApplication.findUnique({
      where: { jobId_studentId: { jobId: params.id, studentId: student.id } },
    });
    return NextResponse.json({ applied: !!application, application });
  } catch {
    return NextResponse.json({ applied: false });
  }
}
