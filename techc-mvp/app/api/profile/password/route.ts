import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function PATCH(req: NextRequest) {
  const token = req.cookies.get("tc_session")?.value;
  if (!token) return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ message: "Unauthorised" }, { status: 401 });

  try {
    const { current, next } = await req.json() as { current: string; next: string };

    if (!current || !next) {
      return NextResponse.json({ message: "Both passwords required" }, { status: 400 });
    }
    if (next.length < 8) {
      return NextResponse.json({ message: "New password must be at least 8 characters" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    const valid = await bcrypt.compare(current, user.password);
    if (!valid) {
      return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(next, 12);
    await prisma.user.update({
      where: { id: payload.id },
      data: { password: hashed },
    });

    return NextResponse.json({ message: "Password updated" });
  } catch (err) {
    console.error("[PASSWORD_CHANGE]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
