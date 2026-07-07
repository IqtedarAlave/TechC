import { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Users, Briefcase, Eye, TrendingUp, ArrowRight, Shield, Clock } from "lucide-react";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Employer Dashboard" };
export const revalidate = 0; // live data

function formatTimeAgo(dateInput: Date) {
  const diffMs = new Date().getTime() - dateInput.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export default async function EmployerDashboard() {
  const cookieStore = cookies();
  const token = cookieStore.get("tc_session")?.value;
  if (!token) redirect("/login");

  const payload = await verifyToken(token);
  if (!payload || payload.role !== "EMPLOYER") redirect("/login");

  const employer = await prisma.employerProfile.findUnique({
    where: { userId: payload.id },
    include: {
      user: true,
      jobs: {
        include: {
          _count: { select: { applications: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!employer) redirect("/login");

  // 1. Calculate Stats
  const activeJobsCount = employer.jobs.filter((j) => j.isActive).length;
  const totalApplications = await prisma.jobApplication.count({
    where: { job: { employerId: employer.id } },
  });
  const shortlistedCount = await prisma.jobApplication.count({
    where: {
      job: { employerId: employer.id },
      status: "SHORTLISTED",
    },
  });

  const STATS = [
    { label: "Active job listings", value: activeJobsCount.toString(), icon: Briefcase, color: "text-brand-400", bg: "bg-brand-500/10" },
    { label: "Total applications", value: totalApplications.toString(), icon: Users, color: "text-purple-400", bg: "bg-purple-500/10" },
    { label: "Profile views", value: "142", icon: Eye, color: "text-yellow-400", bg: "bg-yellow-500/10" }, // Mocked since not in schema
    { label: "Shortlisted", value: shortlistedCount.toString(), icon: TrendingUp, color: "text-accent-400", bg: "bg-accent-500/10" },
  ];

  // 2. Fetch Recent Applications
  const recentApplicationsDb = await prisma.jobApplication.findMany({
    where: { job: { employerId: employer.id } },
    include: {
      student: {
        include: {
          user: { select: { name: true, email: true } },
          submissions: { where: { status: "MENTOR_APPROVED" }, take: 1 },
        },
      },
      job: { select: { title: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  const recentApplications = recentApplicationsDb.map((a) => ({
    id: a.id,
    name: a.student.user.name,
    username: a.student.username,
    university: a.student.university,
    path: a.student.careerPath ? a.student.careerPath.replace(/_/g, " ") : "No path set",
    badge: a.student.submissions.length > 0,
    applied: formatTimeAgo(a.createdAt),
    jobTitle: a.job.title,
  }));

  // 3. Get Employer Jobs List
  const myJobs = employer.jobs.slice(0, 3).map((j) => ({
    id: j.id,
    title: j.title,
    type: j.jobType.replace(/_/g, "-").toLowerCase(),
    applications: j._count.applications,
    active: j.isActive,
  }));

  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Company Dashboard</h1>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-[--text-muted] text-sm">{employer.companyName}</p>
          {!employer.isVerified && (
            <span className="badge-yellow text-[10px]">Pending verification</span>
          )}
          {employer.isVerified && (
            <span className="badge-green text-[10px]">Verified partner</span>
          )}
        </div>
      </div>

      {/* Verification notice */}
      {!employer.isVerified && (
        <div className="card border-yellow-500/20 bg-yellow-500/5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-yellow-300 mb-1">Your account is under review</p>
              <p className="text-xs text-[--text-muted]">TechC verifies employers before activating job listings. Usually within 24 hours.</p>
            </div>
            <Shield className="w-6 h-6 text-yellow-400 shrink-0" aria-label="Pending verification" />
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="stat-card">
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center ${color} mb-3`}>
              <Icon className="w-4 h-4" />
            </div>
            <span className="stat-value">{value}</span>
            <span className="stat-label">{label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Recent applications */}
        <div className="lg:col-span-3 card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="section-title">Recent applications</h2>
              <p className="section-subtitle">Students who applied to your listings</p>
            </div>
            <Link href="/employer/students" className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentApplications.map((a) => (
              <div key={a.id} className="flex items-center gap-4 p-3 rounded-xl bg-surface-muted/50 hover:bg-surface-muted transition-colors">
                <div className="w-9 h-9 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-300 font-bold shrink-0">
                  {a.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-[--text] truncate">{a.name}</p>
                    {a.badge && (
                      <span title="Verified Portfolio" className="shrink-0">
                        <Shield className="w-3 h-3 text-accent-400" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[--text-muted] truncate">{a.university} · {a.path}</p>
                  <p className="text-[10px] text-brand-400 font-medium truncate mt-0.5">Applied for: {a.jobTitle}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-[--text-muted] flex items-center gap-1 justify-end">
                    <Clock className="w-3 h-3" /> {a.applied}
                  </p>
                  <Link href={`/u/${a.username}`} target="_blank"
                    className="text-xs text-brand-400 hover:text-brand-300 block mt-1">View profile →</Link>
                </div>
              </div>
            ))}
            {recentApplications.length === 0 && (
              <p className="text-sm text-[--text-muted] italic py-8 text-center">No applications received yet</p>
            )}
          </div>
        </div>

        {/* Active jobs */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">My listings</h2>
            <Link href="/employer/post-job" className="text-sm text-accent-400 hover:text-accent-300">+ Post new</Link>
          </div>
          <div className="space-y-3">
            {myJobs.map((j) => (
              <div key={j.id} className="p-4 rounded-xl border border-surface-border hover:border-brand-500/20 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-sm font-medium text-[--text] truncate">{j.title}</p>
                  <span className={`badge text-[10px] ${j.active ? "badge-green" : "badge-muted"}`}>
                    {j.active ? "Active" : "Closed"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="badge-blue text-[10px] capitalize">{j.type}</span>
                  <span className="text-xs text-[--text-muted]">{j.applications} application{j.applications !== 1 ? "s" : ""}</span>
                </div>
              </div>
            ))}
            {myJobs.length === 0 && (
              <p className="text-sm text-[--text-muted] italic py-4 text-center">No jobs posted yet</p>
            )}
            <Link href="/employer/post-job" className="btn-primary w-full text-center text-sm">
              Post a new job
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
