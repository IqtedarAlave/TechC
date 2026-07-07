import { Metadata } from "next";
import Link from "next/link";
import {
  Users, Building2, FileCheck, Award,
  AlertCircle, CheckCircle, Clock,
  ArrowRight,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PendingCompaniesList } from "@/components/admin/PendingCompaniesList";

export const metadata: Metadata = { title: "Admin — TechC" };
export const revalidate = 0; // Disable caching to fetch live data

function formatTimeAgo(dateInput: Date) {
  const diffMs = new Date().getTime() - dateInput.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

const STAGE_CONFIG: Record<string, { label: string; badge: string }> = {
  PENDING:      { label: "Needs auto check", badge: "badge-muted" },
  AUTO_CHECKED: { label: "Needs AI review", badge: "badge-blue" },
  AI_REVIEWED:  { label: "Needs mentor review", badge: "badge-yellow" },
};

export default async function AdminDashboard() {
  // 1. Stats and metrics
  const totalStudents = await prisma.studentProfile.count();
  const totalCompanies = await prisma.employerProfile.count();
  const pendingCompaniesCount = await prisma.employerProfile.count({ where: { isVerified: false } });
  const totalSubmissions = await prisma.projectSubmission.count();
  const awaitingSubmissionsCount = await prisma.projectSubmission.count({
    where: { status: { in: ["AUTO_CHECKED", "AI_REVIEWED", "PENDING"] } }
  });
  const totalBadges = await prisma.projectSubmission.count({
    where: { status: "MENTOR_APPROVED" }
  });

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const newStudentsThisWeek = await prisma.studentProfile.count({
    where: { createdAt: { gte: oneWeekAgo } }
  });

  const hiredCount = await prisma.jobApplication.count({
    where: { status: "HIRED" }
  });
  const placementPercentage = Math.min(Math.round((hiredCount / 10) * 100), 100);

  const STATS = [
    { label: "Total students", value: totalStudents.toString(), icon: Users, color: "text-brand-400", bg: "bg-brand-500/10", change: `+${newStudentsThisWeek} this week` },
    { label: "Companies", value: totalCompanies.toString(), icon: Building2, color: "text-purple-400", bg: "bg-purple-500/10", change: `${pendingCompaniesCount} pending review` },
    { label: "Submissions", value: totalSubmissions.toString(), icon: FileCheck, color: "text-yellow-400", bg: "bg-yellow-500/10", change: `${awaitingSubmissionsCount} awaiting review` },
    { label: "Badges issued", value: totalBadges.toString(), icon: Award, color: "text-accent-400", bg: "bg-accent-500/10", change: "All-time" },
  ];

  // 2. Pending submissions for mentor review
  const pendingSubmissionsDb = await prisma.projectSubmission.findMany({
    where: { status: { in: ["AUTO_CHECKED", "AI_REVIEWED", "PENDING"] } },
    include: {
      student: {
        include: { user: { select: { name: true } } }
      },
      project: true,
    },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  const pendingSubmissions = pendingSubmissionsDb.map((s) => ({
    id: s.id,
    student: s.student.user.name,
    project: s.project.title,
    university: s.student.university,
    stage: s.status,
    since: formatTimeAgo(s.createdAt)
  }));

  // 3. Pending company verifications
  const pendingCompaniesDb = await prisma.employerProfile.findMany({
    where: { isVerified: false },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  const pendingCompanies = pendingCompaniesDb.map((c) => ({
    id: c.id,
    companyName: c.companyName,
    industry: c.industry,
    location: c.location,
    createdAt: c.createdAt.toISOString()
  }));

  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Admin Overview</h1>
        <p className="text-[--text-muted] text-sm mt-1">TechC platform — founder view</p>
      </div>

      {/* North star metric */}
      <div className="card border-brand-500/30 bg-brand-500/5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-[--text-muted] uppercase tracking-wider mb-1">North star metric</p>
            <p className="text-2xl font-display font-bold text-white">{hiredCount} / 10 placements</p>
            <p className="text-sm text-[--text-muted] mt-1">Target: 10 actual student placements through TechC</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-40 h-2 rounded-full bg-surface-muted overflow-hidden">
                <div className="h-full bg-brand-500 rounded-full" style={{ width: `${placementPercentage}%` }} />
              </div>
              <span className="text-xs text-[--text-muted]">{placementPercentage}%</span>
            </div>
            <p className="text-xs text-[--text-muted]">
              {hiredCount === 0 ? "First placement needed" : `${10 - hiredCount} more to reach target`}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, value, icon: Icon, color, bg, change }) => (
          <div key={label} className="stat-card">
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center ${color} mb-3`}>
              <Icon className="w-4 h-4" />
            </div>
            <span className="stat-value">{value}</span>
            <span className="stat-label">{label}</span>
            <span className="text-[10px] text-[--text-muted] mt-1">{change}</span>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        {/* Pending submissions for mentor review */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="section-title">Needs your review</h2>
              <p className="section-subtitle">Submissions waiting for mentor approval</p>
            </div>
            <Link href="/admin/submissions" className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1">
              All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {pendingSubmissions.map((s) => {
              const stage = STAGE_CONFIG[s.stage] || { label: s.stage, badge: "badge-muted" };
              return (
                <div key={s.id} className="flex items-start gap-3 p-3 rounded-xl bg-surface-muted/50 hover:bg-surface-muted transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center text-brand-300 font-bold text-sm shrink-0">
                    {s.student[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[--text] truncate">{s.project}</p>
                    <p className="text-xs text-[--text-muted]">{s.student} · {s.university}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`${stage.badge} text-[10px] block mb-1`}>{stage.label}</span>
                    <span className="text-[10px] text-[--text-muted]">{s.since}</span>
                  </div>
                </div>
              );
            })}
            {pendingSubmissions.length === 0 && (
              <p className="text-sm text-[--text-muted] italic py-4 text-center">No submissions awaiting review</p>
            )}
            <Link href="/admin/submissions" className="btn-secondary w-full text-center text-sm mt-6">
              Review all submissions
            </Link>
          </div>
        </div>

        {/* Pending company verifications */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="section-title">Company verification</h2>
              <p className="section-subtitle">New employers awaiting approval</p>
            </div>
            <Link href="/admin/companies" className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1">
              All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <PendingCompaniesList initialCompanies={pendingCompanies} />
        </div>
      </div>

      {/* Quick actions */}
      <div className="card">
        <h2 className="section-title mb-4">Quick actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Review submissions", href: "/admin/submissions", icon: FileCheck, color: "text-yellow-400" },
            { label: "Verify companies", href: "/admin/companies", icon: Building2, color: "text-purple-400" },
            { label: "Manage users", href: "/admin/users", icon: Users, color: "text-brand-400" },
            { label: "Issued badges", href: "/admin/badges", icon: Award, color: "text-accent-400" },
          ].map(({ label, href, icon: Icon, color }) => (
            <Link key={href} href={href}
              className="card-hover flex flex-col items-center gap-2 p-4 text-center group">
              <Icon className={`w-5 h-5 ${color}`} />
              <span className="text-xs font-medium text-[--text-muted] group-hover:text-[--text] transition-colors">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
