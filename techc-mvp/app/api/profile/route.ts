import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { z } from "zod";

const ProfileSchema = z.object({
  name:         z.string().min(2).optional(),
  bio:          z.string().max(200).optional(),
  githubUrl:    z.string().url().optional().or(z.literal("")),
  linkedinUrl:  z.string().url().optional().or(z.literal("")),
  portfolioUrl: z.string().url().optional().or(z.literal("")),
  skills:       z.array(z.string()).max(12).optional(),
  isPublic:     z.boolean().optional(),
});

export async function PATCH(req: NextRequest) {
  const token = req.cookies.get("tc_session")?.value;
  if (!token) return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  const payload = await verifyToken(token);
  if (!payload || payload.role !== "STUDENT") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const data = ProfileSchema.parse(body);

    // Update User.name if provided
    if (data.name) {
      await prisma.user.update({
        where: { id: payload.id },
        data: { name: data.name },
      });
    }

    const { name: _, ...profileData } = data;

    const profile = await prisma.studentProfile.update({
      where: { userId: payload.id },
      data: {
        ...(profileData.bio          !== undefined ? { bio:          profileData.bio }          : {}),
        ...(profileData.githubUrl    !== undefined ? { githubUrl:    profileData.githubUrl || null }    : {}),
        ...(profileData.linkedinUrl  !== undefined ? { linkedinUrl:  profileData.linkedinUrl || null }  : {}),
        ...(profileData.portfolioUrl !== undefined ? { portfolioUrl: profileData.portfolioUrl || null } : {}),
        ...(profileData.skills       !== undefined ? { skills:       profileData.skills }       : {}),
        ...(profileData.isPublic     !== undefined ? { isPublic:     profileData.isPublic }     : {}),
      },
    });

    return NextResponse.json({ profile });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ message: err.errors[0].message }, { status: 422 });
    }
    console.error("[PROFILE_PATCH]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get("tc_session")?.value;
  if (!token) return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ message: "Unauthorised" }, { status: 401 });

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      include: { studentProfile: true },
    });
    return NextResponse.json({ user });
  } catch (err) {
    console.error("[PROFILE_GET]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
