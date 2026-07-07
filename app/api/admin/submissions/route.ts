import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

/** GET /api/admin/submissions — all submissions with filters */
export async function GET(req: NextRequest) {
  const token = req.cookies.get("tc_session")?.value;
  if (!token) return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  const payload = await verifyToken(token);
  if (!payload || payload.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");   // e.g. AI_REVIEWED
  const path   = searchParams.get("path");     // e.g. WEB_DEV

  try {
    const submissions = await prisma.projectSubmission.findMany({
      where: {
        ...(status ? { status: status as any } : {}),
        ...(path   ? { project: { roadmap: { path: path as any } } } : {}),
      },
      include: {
        student: { include: { user: { select: { name: true, email: true } } } },
        project: { include: { roadmap: { select: { path: true, title: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ submissions, total: submissions.length });
  } catch (err) {
    console.error("[ADMIN_SUBMISSIONS_LIST]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
