import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { signToken } from "@/lib/auth";
import { EmployerRegisterSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = EmployerRegisterSchema.parse(body);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return NextResponse.json({ message: "Email already registered" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashed,
        role: "EMPLOYER",
        employerProfile: {
          create: {
            companyName: data.companyName,
            website: data.website || null,
            industry: data.industry,
            size: data.size,
            location: data.location,
            description: data.description || null,
            isVerified: false, // admin must verify
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
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return res;

  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ message: err.errors[0].message }, { status: 422 });
    }
    console.error("[REGISTER_EMPLOYER]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
