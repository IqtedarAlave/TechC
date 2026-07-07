import { Metadata } from "next";
import {
  GitBranch, Award, Briefcase, TrendingUp,
  Clock, CheckCircle, AlertCircle, ArrowRight,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = { title: "Dashboard" };

// Mock data — replace with real DB calls via Prisma
const STATS = [
  { label: "Projects submitted", value: "3", icon: GitBranch, color: "text-brand-400", bg: "bg-brand-500/10" },
  { label: "Badges earned", value: "1", icon: Award, color: "text-accent-400", bg: "bg-accent-500/10" },
  { label: "Jobs applied", value: "2", icon: Briefcase, color: "text-purple-400", bg: "bg-purple-500/10" },
  { label: "Profile strength", value: "72%", icon: TrendingUp, color: "text-yellow-400", bg: "bg-yellow-500/10" },
];

const RECENT_SUBMISSIONS = [
  { name: "Portfolio Website", status: "MENTOR_APPROVED", score: 89, path: "Web Dev" },
  { name: "REST API with Node.js", status: "AI_REVIEWED", score: 81, path: "Web Dev" },
  { name: "React Todo App", status: "PENDING", score: null, path: "Web Dev" },
];

const STATUS_MAP: Record<string, { label: string; class: string; icon: React.ReactNode }> = {
  PENDING:         { label: "Pending review", class: "badge-muted", icon: <Clock className="w-3 h-3" /> },
  AUTO_CHECKED:    { label: "Auto checked",   class: "badge-blue",  icon: <CheckCircle className="w-3 h-3" /> },
  AI_REVIEWED:     { label: "AI reviewed",    class: "badge-yellow", icon: <CheckCircle className="w-3 h-3" /> },
  MENTOR_APPROVED: { label: "Mentor approved", class: "badge-green", icon: <CheckCircle className="w-3 h-3" /> },
  REJECTED:        { label: "Rejected",        class: "badge-red",   icon: <AlertCircle className="w-3 h-3" /> },
};

const NEXT_PROJECTS = [
  { title: "Build a full-stack CRUD app", difficulty: "Junior", skills: ["React", "Express", "PostgreSQL"] },
  { title: "JWT Authentication system", difficulty: "Mid", skills: ["Node.js", "JWT", "bcrypt"] },
];

export default function StudentDashboard() {
  return (
    <div className="space-y-8 animate-fade-up">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Good morning, Iqtedar 👋</h1>
        <p className="text-[--text-muted] text-sm mt-1">
          You&apos;re on the <span className="text-brand-400 font-medium">Web Development</span> track. Keep building.
        </p>
      </div>

      {/* Profile completeness banner */}
      <div className="card border-yellow-500/20 bg-yellow-500/5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-300 mb-1">Complete your profile — 72% done</p>
            <div className="progress-bar">
              <div className="progress-fill bg-yellow-400" style={{ width: "72%" }} />
            </div>
          </div>
          <Link href="/profile" className="btn-secondary text-sm shrink-0">
            Complete profile
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="stat-card">
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center ${color} mb-3`}>
              <Icon className="w-4.5 h-4.5" />
            </div>
            <span className="stat-value">{value}</span>
            <span className="stat-label">{label}</span>
          </div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-5 gap-6">

        {/* Recent submissions */}
        <div className="lg:col-span-3 card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="section-title">Recent submissions</h2>
              <p className="section-subtitle">Your latest project validations</p>
            </div>
            <Link href="/projects" className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {RECENT_SUBMISSIONS.map((sub) => {
              const s = STATUS_MAP[sub.status];
              return (
                <div key={sub.name} className="flex items-center gap-4 p-3 rounded-xl bg-surface-muted/50 hover:bg-surface-muted transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400">
                    <GitBranch className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[--text] truncate">{sub.name}</p>
                    <p className="text-xs text-[--text-muted]">{sub.path}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`${s.class} flex items-center gap-1`}>
                      {s.icon} {s.label}
                    </span>
                    {sub.score && (
                      <span className="text-xs text-[--text-muted]">{sub.score}/100</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Next up */}
        <div className="lg:col-span-2 card">
          <div className="mb-5">
            <h2 className="section-title">Next on your roadmap</h2>
            <p className="section-subtitle">Suggested projects to tackle</p>
          </div>

          <div className="space-y-4">
            {NEXT_PROJECTS.map((p) => (
              <div key={p.title} className="p-4 rounded-xl border border-surface-border hover:border-brand-500/30 transition-colors group">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-sm font-medium text-[--text] group-hover:text-white transition-colors">{p.title}</p>
                  <span className="badge-blue text-[10px] shrink-0">{p.difficulty}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {p.skills.map((s) => (
                    <span key={s} className="badge-muted text-[10px]">{s}</span>
                  ))}
                </div>
              </div>
            ))}

            <Link href="/roadmap" className="btn-secondary w-full flex items-center justify-center gap-2 text-sm mt-2">
              View full roadmap <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Jobs section teaser */}
      <div className="card border-accent-500/20 bg-accent-500/5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-accent-400 mb-1">3 internships match your profile</p>
            <p className="text-sm text-[--text-muted]">Earn your mentor badge to unlock direct applications.</p>
          </div>
          <Link href="/jobs" className="btn-secondary text-sm shrink-0 border-accent-500/20 hover:border-accent-500/40">
            View jobs
          </Link>
        </div>
      </div>
    </div>
  );
}
