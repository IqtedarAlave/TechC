import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { signToken } from "@/lib/auth";

const StudentSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(3).regex(/^[a-z0-9_]+$/),
  university: z.string().min(2),
  department: z.enum(["CSE", "EEE"]),
  graduationYear: z.coerce.number().min(2024).max(2030),
  careerPath: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = StudentSchema.parse(body);

    // Check uniqueness
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return NextResponse.json({ message: "Email already registered" }, { status: 400 });
    }

    const usernameExists = await prisma.studentProfile.findUnique({ where: { username: data.username } });
    if (usernameExists) {
      return NextResponse.json({ message: "Username taken — try another" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashed,
        role: "STUDENT",
        studentProfile: {
          create: {
            username: data.username,
            university: data.university,
            department: data.department,
            graduationYear: data.graduationYear,
            careerPath: data.careerPath as any,
            portfolioUrl: `techc.app/u/${data.username}`,
          },
        },
      },
    });

    const token = await signToken({ id: user.id, role: user.role });

    const res = NextResponse.json({ message: "Account created", role: user.role }, { status: 201 });
    res.cookies.set("tc_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
    return res;

  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ message: err.errors[0].message }, { status: 422 });
    }
    console.error("[REGISTER_STUDENT]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
