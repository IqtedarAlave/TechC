import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { generateBadgeUid } from "@/lib/utils";
import { z } from "zod";

const ReviewSchema = z.object({
  action: z.enum(["approve", "reject"]),
  mentorNotes: z.string().min(10, "Mentor notes must be at least 10 characters"),
});

/** PATCH /api/admin/submissions/[id] — approve or reject */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = req.cookies.get("tc_session")?.value;
  if (!token) return NextResponse.json({ message: "Unauthorised" }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload || payload.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { action, mentorNotes } = ReviewSchema.parse(body);

    const existing = await prisma.projectSubmission.findUnique({
      where: { id: params.id },
    });
    if (!existing) {
      return NextResponse.json({ message: "Submission not found" }, { status: 404 });
    }

    if (action === "approve") {
      const uid = generateBadgeUid();
      const updated = await prisma.projectSubmission.update({
        where: { id: params.id },
        data: {
          status: "MENTOR_APPROVED",
          mentorNotes,
          mentorApprovedAt: new Date(),
          badgeUid: uid,
        },
      });
      return NextResponse.json({ submission: updated, badgeUid: uid });
    } else {
      const updated = await prisma.projectSubmission.update({
        where: { id: params.id },
        data: {
          status: "REJECTED",
          mentorNotes,
        },
      });
      return NextResponse.json({ submission: updated });
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ message: err.errors[0].message }, { status: 422 });
    }
    console.error("[ADMIN_SUBMISSION_REVIEW]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

/** GET /api/admin/submissions/[id] — get single submission detail */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = req.cookies.get("tc_session")?.value;
  if (!token) return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  const payload = await verifyToken(token);
  if (!payload || payload.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const submission = await prisma.projectSubmission.findUnique({
      where: { id: params.id },
      include: {
        student: { include: { user: true } },
        project: { include: { roadmap: true } },
      },
    });
    if (!submission) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json({ submission });
  } catch (err) {
    console.error("[ADMIN_SUBMISSION_GET]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
