import { Metadata } from "next";
import Link from "next/link";
import {
  Users, Building2, FileCheck, Award,
  TrendingUp, AlertCircle, CheckCircle, Clock,
  ArrowRight, Shield,
} from "lucide-react";

export const metadata: Metadata = { title: "Admin — TechC" };

const STATS = [
  { label: "Total students", value: "47", icon: Users, color: "text-brand-400", bg: "bg-brand-500/10", change: "+12 this week" },
  { label: "Companies", value: "8", icon: Building2, color: "text-purple-400", bg: "bg-purple-500/10", change: "+3 pending review" },
  { label: "Submissions", value: "89", icon: FileCheck, color: "text-yellow-400", bg: "bg-yellow-500/10", change: "14 awaiting review" },
  { label: "Badges issued", value: "23", icon: Award, color: "text-accent-400", bg: "bg-accent-500/10", change: "All-time" },
];

const PENDING_SUBMISSIONS = [
  { student: "Rafi Islam", project: "REST API with Node.js", university: "BUET", stage: "AI_REVIEWED", since: "2h ago" },
  { student: "Tasnim Akter", project: "CNN Image Classifier", university: "NSU", stage: "AUTO_CHECKED", since: "5h ago" },
  { student: "Mehedi Hassan", project: "Portfolio Website", university: "BRAC", stage: "AI_REVIEWED", since: "1d ago" },
];

const PENDING_COMPANIES = [
  { name: "Shajgoj Tech", industry: "E-commerce", location: "Dhaka", applied: "1d ago" },
  { name: "Maya Technologies", industry: "Healthcare Tech", location: "Dhaka", applied: "2d ago" },
  { name: "10 Minute School", industry: "EdTech", location: "Dhaka", applied: "3d ago" },
];

const STAGE_CONFIG: Record<string, { label: string; badge: string }> = {
  AUTO_CHECKED: { label: "Needs AI review", badge: "badge-blue" },
  AI_REVIEWED:  { label: "Needs mentor review", badge: "badge-yellow" },
};

export default function AdminDashboard() {
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
            <p className="text-2xl font-display font-bold text-white">0 / 10 placements</p>
            <p className="text-sm text-[--text-muted] mt-1">Target: 10 actual student placements through TechC</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-40 h-2 rounded-full bg-surface-muted overflow-hidden">
                <div className="h-full bg-brand-500 rounded-full" style={{ width: "0%" }} />
              </div>
              <span className="text-xs text-[--text-muted]">0%</span>
            </div>
            <p className="text-xs text-[--text-muted]">First placement needed</p>
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
            {PENDING_SUBMISSIONS.map((s) => {
              const stage = STAGE_CONFIG[s.stage];
              return (
                <div key={s.student + s.project} className="flex items-start gap-3 p-3 rounded-xl bg-surface-muted/50 hover:bg-surface-muted transition-colors">
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
          </div>
          <div className="mt-5">
            <Link href="/admin/submissions" className="btn-secondary block w-full text-center text-sm">
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
          <div className="space-y-3">
            {PENDING_COMPANIES.map((c) => (
              <div key={c.name} className="flex items-center gap-3 p-3 rounded-xl bg-surface-muted/50 hover:bg-surface-muted transition-colors">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-300 font-bold text-sm shrink-0">
                  {c.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[--text] truncate">{c.name}</p>
                  <p className="text-xs text-[--text-muted]">{c.industry} · {c.location}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button className="w-7 h-7 rounded-lg bg-accent-500/10 text-accent-400 hover:bg-accent-500/20 flex items-center justify-center transition-colors">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </button>
                  <button className="w-7 h-7 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-colors">
                    <AlertCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
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
