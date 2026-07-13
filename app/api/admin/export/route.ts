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

  try {
    const users = await prisma.user.findMany({
      include: {
        studentProfile: true,
        employerProfile: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const headers = [
      "User ID",
      "Role",
      "Created At",
      "Updated At",
      "Student University",
      "Student Department",
      "Student Graduation Year",
      "Student Career Path",
      "Student Bio",
      "Student Skills",
      "Student Is Public",
      "Company Name",
      "Company Website",
      "Company Industry",
      "Company Size",
      "Company Description",
      "Company Location",
      "Company Is Verified",
    ];

    const escapeCSV = (val: any) => {
      if (val === null || val === undefined) return "";
      let str = "";
      if (Array.isArray(val)) {
        str = val.join("; ");
      } else if (val instanceof Date) {
        str = val.toISOString();
      } else {
        str = String(val);
      }
      if (/[",\n\r]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const rows = users.map((user) => {
      const student = user.studentProfile;
      const employer = user.employerProfile;

      return [
        user.id,
        user.role,
        user.createdAt,
        user.updatedAt,
        // Student details (anonymized)
        student?.university ?? "",
        student?.department ?? "",
        student?.graduationYear ?? "",
        student?.careerPath ?? "",
        student?.bio ?? "",
        student?.skills ?? "",
        student?.isPublic !== undefined ? String(student.isPublic) : "",
        // Employer/Company details
        employer?.companyName ?? "",
        employer?.website ?? "",
        employer?.industry ?? "",
        employer?.size ?? "",
        employer?.description ?? "",
        employer?.location ?? "",
        employer?.isVerified !== undefined ? String(employer.isVerified) : "",
      ].map(escapeCSV);
    });

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=techc-data-export.csv",
      },
    });
  } catch (err) {
    console.error("[ADMIN_EXPORT_DATA]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
