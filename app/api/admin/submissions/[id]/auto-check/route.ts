import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { runAutoCheck } from "@/lib/autoCheck";

/**
 * POST /api/admin/submissions/[id]/auto-check
 *
 * Layer 1: Automated checks on the GitHub repository.
 * Uses GitHub API to verify: repo exists, is public,
 * has README, has commits, and checks basic structure.
 */
export async function POST(
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
    });
    if (!submission) return NextResponse.json({ message: "Not found" }, { status: 404 });
    if (submission.status !== "PENDING") {
      return NextResponse.json({ message: "Already checked" }, { status: 400 });
    }

    const outcome = await runAutoCheck(params.id);

    return NextResponse.json({
      passed: outcome.passed,
      score: outcome.score,
      checks: outcome.checks,
      notes: outcome.notes,
    });
  } catch (err) {
    console.error("[AUTO_CHECK]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
