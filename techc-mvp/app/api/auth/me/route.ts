import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("tc_session")?.value;
  if (!token) return NextResponse.json({ user: null }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ user: null }, { status: 401 });

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      include: {
        studentProfile: { select: { username: true, careerPath: true, university: true, department: true } },
        employerProfile: { select: { companyName: true, isVerified: true } },
      },
    });

    if (!user) return NextResponse.json({ user: null }, { status: 401 });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        username: user.studentProfile?.username,
        careerPath: user.studentProfile?.careerPath,
        university: user.studentProfile?.university,
        companyName: user.employerProfile?.companyName,
        isVerified: user.employerProfile?.isVerified,
      },
    });
  } catch (err) {
    console.error("[ME]", err);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
