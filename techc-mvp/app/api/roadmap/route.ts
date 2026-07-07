import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

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
      include: {
        submissions: {
          select: { projectId: true, status: true, badgeUid: true },
        },
      },
    });

    if (!student?.careerPath) {
      return NextResponse.json({ roadmap: null, message: "No career path selected" });
    }

    const roadmap = await prisma.careerRoadmap.findUnique({
      where: { path: student.careerPath },
      include: { projects: { orderBy: { order: "asc" } } },
    });

    if (!roadmap) return NextResponse.json({ roadmap: null });

    type SubInfo = { status: string; badgeUid: string | null };
    const submissionMap = new Map<string, SubInfo>(
      student.submissions.map((s: { projectId: string; status: string; badgeUid: string | null }) => [
        s.projectId,
        { status: s.status, badgeUid: s.badgeUid },
      ])
    );

    const projectsWithStatus = roadmap.projects.map((p: { id: string; [key: string]: unknown }) => ({
      ...p,
      submissionStatus: submissionMap.get(p.id)?.status ?? null,
      badgeUid:         submissionMap.get(p.id)?.badgeUid ?? null,
    }));

    return NextResponse.json({
      roadmap: { ...roadmap, projects: projectsWithStatus },
      careerPath:        student.careerPath,
      totalProjects:     roadmap.projects.length,
      completedProjects: student.submissions.filter(
        (s: { status: string }) => s.status === "MENTOR_APPROVED"
      ).length,
    });
  } catch (err) {
    console.error("[ROADMAP_GET]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
