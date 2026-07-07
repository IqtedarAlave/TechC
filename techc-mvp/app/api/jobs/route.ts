import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { z } from "zod";

const JobSchema = z.object({
  title:        z.string().min(3),
  description:  z.string().min(20),
  requirements: z.array(z.string()).optional().default([]),
  careerPath:   z.string().min(1),
  jobType:      z.enum(["INTERNSHIP", "FULL_TIME", "PART_TIME", "CONTRACT"]),
  salaryRange:  z.string().optional(),
  location:     z.string().min(2),
  deadline:     z.string().optional(),
});

/** GET /api/jobs — public job listings (filtered by path, type, location) */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const path     = searchParams.get("path");
  const type     = searchParams.get("type");
  const location = searchParams.get("location");

  try {
    const jobs = await prisma.job.findMany({
      where: {
        isActive: true,
        ...(path     ? { careerPath: path as any }     : {}),
        ...(type     ? { jobType:    type as any }      : {}),
        ...(location ? { location:   { contains: location } } : {}),
      },
      include: {
        employer: {
          select: {
            companyName: true, location: true, isVerified: true,
            user: { select: { name: true } },
          },
        },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ jobs });
  } catch (err) {
    console.error("[JOBS_GET]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

/** POST /api/jobs — employer posts a new job */
export async function POST(req: NextRequest) {
  const token = req.cookies.get("tc_session")?.value;
  if (!token) return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  const payload = await verifyToken(token);
  if (!payload || payload.role !== "EMPLOYER") {
    return NextResponse.json({ message: "Only employers can post jobs" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const data = JobSchema.parse(body);

    const employer = await prisma.employerProfile.findUnique({
      where: { userId: payload.id },
    });
    if (!employer) return NextResponse.json({ message: "Employer profile not found" }, { status: 404 });

    const job = await prisma.job.create({
      data: {
        employerId:   employer.id,
        title:        data.title,
        description:  data.description,
        requirements: data.requirements,
        careerPath:   data.careerPath as any,
        jobType:      data.jobType,
        salaryRange:  data.salaryRange ?? null,
        location:     data.location,
        deadline:     data.deadline ? new Date(data.deadline) : null,
        isActive:     true,
      },
    });

    return NextResponse.json({ job }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ message: err.errors[0].message }, { status: 422 });
    }
    console.error("[JOBS_POST]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
