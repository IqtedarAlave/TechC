import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

/** GET /api/submissions/[id] */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = req.cookies.get("tc_session")?.value;
  if (!token) return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ message: "Unauthorised" }, { status: 401 });

  try {
    const submission = await prisma.projectSubmission.findUnique({
      where: { id: params.id },
      include: {
        project: { include: { roadmap: true } },
        student: { select: { userId: true, username: true } },
      },
    });

    if (!submission) return NextResponse.json({ message: "Not found" }, { status: 404 });

    // Students can only see their own
    if (payload.role === "STUDENT" && submission.student.userId !== payload.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ submission });
  } catch (err) {
    console.error("[SUBMISSION_GET]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

/** DELETE /api/submissions/[id] — student can withdraw a PENDING submission */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = req.cookies.get("tc_session")?.value;
  if (!token) return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  const payload = await verifyToken(token);
  if (!payload || payload.role !== "STUDENT") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const submission = await prisma.projectSubmission.findUnique({
      where: { id: params.id },
      include: { student: { select: { userId: true } } },
    });

    if (!submission) return NextResponse.json({ message: "Not found" }, { status: 404 });
    if (submission.student.userId !== payload.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    if (submission.status !== "PENDING") {
      return NextResponse.json(
        { message: "Cannot withdraw a submission already in review" },
        { status: 400 }
      );
    }

    await prisma.projectSubmission.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Submission withdrawn" });
  } catch (err) {
    console.error("[SUBMISSION_DELETE]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
