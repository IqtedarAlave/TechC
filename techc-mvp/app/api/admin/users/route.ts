import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

/** GET /api/admin/users — list all users with optional role filter */
export async function GET(req: NextRequest) {
  const token = req.cookies.get("tc_session")?.value;
  if (!token) return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  const payload = await verifyToken(token);
  if (!payload || payload.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const role   = searchParams.get("role");   // STUDENT | EMPLOYER | ADMIN
  const search = searchParams.get("q");

  try {
    const users = await prisma.user.findMany({
      where: {
        ...(role   ? { role: role as any } : {}),
        ...(search ? {
          OR: [
            { name:  { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        } : {}),
      },
      include: {
        studentProfile: {
          select: {
            username: true, university: true, department: true,
            careerPath: true,
            _count: { select: { submissions: true } },
          },
        },
        employerProfile: {
          select: { companyName: true, isVerified: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ users, total: users.length });
  } catch (err) {
    console.error("[ADMIN_USERS_LIST]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

/** DELETE /api/admin/users?id=[userId] */
export async function DELETE(req: NextRequest) {
  const token = req.cookies.get("tc_session")?.value;
  if (!token) return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  const payload = await verifyToken(token);
  if (!payload || payload.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("id");
  if (!userId) return NextResponse.json({ message: "User ID required" }, { status: 400 });

  // Cannot delete yourself
  if (userId === payload.id) {
    return NextResponse.json({ message: "Cannot delete your own account" }, { status: 400 });
  }

  try {
    await prisma.user.delete({ where: { id: userId } });
    return NextResponse.json({ message: "User deleted" });
  } catch (err) {
    console.error("[ADMIN_USER_DELETE]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
