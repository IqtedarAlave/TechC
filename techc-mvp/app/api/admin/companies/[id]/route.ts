import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

/** PATCH /api/admin/companies/[id] — verify or reject employer */
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
    const { action } = await req.json() as { action: "verify" | "reject" };

    if (action === "verify") {
      const employer = await prisma.employerProfile.update({
        where: { id: params.id },
        data: { isVerified: true },
        include: { user: { select: { name: true, email: true } } },
      });
      return NextResponse.json({ employer });
    }

    if (action === "reject") {
      // Get user id first, then delete cascades through profile
      const employer = await prisma.employerProfile.findUnique({
        where: { id: params.id },
        select: { userId: true },
      });
      if (!employer) return NextResponse.json({ message: "Not found" }, { status: 404 });
      await prisma.user.delete({ where: { id: employer.userId } });
      return NextResponse.json({ message: "Company rejected and removed" });
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error("[ADMIN_COMPANY_PATCH]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

/** GET /api/admin/companies/[id] — single company detail */
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
    const employer = await prisma.employerProfile.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { name: true, email: true, createdAt: true } },
        jobs: { where: { isActive: true }, select: { id: true, title: true } },
      },
    });
    if (!employer) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json({ employer });
  } catch (err) {
    console.error("[ADMIN_COMPANY_GET]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
