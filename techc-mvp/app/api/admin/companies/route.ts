import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("tc_session")?.value;
  if (!token) return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  const payload = await verifyToken(token);
  if (!payload || payload.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const verified = searchParams.get("verified"); // "true" | "false" | null

  try {
    const employers = await prisma.employerProfile.findMany({
      where: verified !== null ? { isVerified: verified === "true" } : {},
      include: {
        user: { select: { name: true, email: true, createdAt: true } },
        _count: { select: { jobs: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ employers, total: employers.length });
  } catch (err) {
    console.error("[ADMIN_COMPANIES_LIST]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
