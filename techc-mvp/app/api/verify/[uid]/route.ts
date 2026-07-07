import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** GET /api/verify/[uid] — public, no auth required */
export async function GET(
  _req: NextRequest,
  { params }: { params: { uid: string } }
) {
  try {
    const submission = await prisma.projectSubmission.findUnique({
      where: { badgeUid: params.uid },
      include: {
        student: {
          include: {
            user: { select: { name: true } },
          },
        },
        project: {
          include: { roadmap: { select: { title: true, path: true } } },
        },
      },
    });

    if (!submission || submission.status !== "MENTOR_APPROVED") {
      return NextResponse.json(
        { valid: false, message: "Badge not found or not yet approved" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      valid: true,
      badge: {
        uid:           params.uid,
        studentName:   submission.student.user.name,
        username:      submission.student.username,
        projectTitle:  submission.project.title,
        careerPath:    submission.project.roadmap.title,
        difficulty:    submission.project.difficulty,
        autoScore:     submission.autoCheckScore,
        aiScore:       submission.aiReviewScore,
        mentorNotes:   submission.mentorNotes,
        approvedAt:    submission.mentorApprovedAt,
      },
    });
  } catch (err) {
    console.error("[VERIFY_BADGE]", err);
    return NextResponse.json({ valid: false, message: "Server error" }, { status: 500 });
  }
}
