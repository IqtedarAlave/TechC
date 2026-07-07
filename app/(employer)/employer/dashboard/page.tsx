import { Metadata } from "next";
import Link from "next/link";
import { Users, Briefcase, Eye, TrendingUp, ArrowRight, Shield, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = { title: "Employer Dashboard" };

const STATS = [
  { label: "Active job listings", value: "3", icon: Briefcase, color: "text-brand-400", bg: "bg-brand-500/10" },
  { label: "Total applications", value: "28", icon: Users, color: "text-purple-400", bg: "bg-purple-500/10" },
  { label: "Profile views", value: "142", icon: Eye, color: "text-yellow-400", bg: "bg-yellow-500/10" },
  { label: "Shortlisted", value: "6", icon: TrendingUp, color: "text-accent-400", bg: "bg-accent-500/10" },
];

const RECENT_APPLICATIONS = [
  { name: "Rafi Islam", university: "BUET", path: "Web Dev", badge: true, applied: "2h ago" },
  { name: "Tasnim Akter", university: "NSU", path: "AI/ML", badge: true, applied: "5h ago" },
  { name: "Mehedi Hassan", university: "BRAC", path: "Web Dev", badge: false, applied: "1d ago" },
  { name: "Sumaiya Khatun", university: "SUST", path: "DevOps", badge: true, applied: "1d ago" },
];

const MY_JOBS = [
  { title: "Junior Frontend Developer", type: "Full-time", applications: 12, active: true },
  { title: "React Intern", type: "Internship", applications: 11, active: true },
  { title: "Node.js Backend Intern", type: "Internship", applications: 5, active: true },
];

export default function EmployerDashboard() {
  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Company Dashboard</h1>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-[--text-muted] text-sm">Acme Technologies Ltd.</p>
          <span className="badge-yellow text-[10px]">Pending verification</span>
        </div>
      </div>

      {/* Verification notice */}
      <div className="card border-yellow-500/20 bg-yellow-500/5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-yellow-300 mb-1">Your account is under review</p>
            <p className="text-xs text-[--text-muted]">TechC verifies employers before activating job listings. Usually within 24 hours.</p>
          </div>
          <Shield className="w-6 h-6 text-yellow-400 shrink-0" aria-label="Pending verification" />
        </div>
      </div>

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

      <div className="grid lg:grid-cols-5 gap-6">

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
            {RECENT_APPLICATIONS.map((a) => (
              <div key={a.name} className="flex items-center gap-4 p-3 rounded-xl bg-surface-muted/50 hover:bg-surface-muted transition-colors">
                <div className="w-9 h-9 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-300 font-bold shrink-0">
                  {a.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-[--text] truncate">{a.name}</p>
                    {a.badge && <Shield className="w-3 h-3 text-accent-400 shrink-0" />}
                  </div>
                  <p className="text-xs text-[--text-muted]">{a.university} · {a.path}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-[--text-muted] flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {a.applied}
                  </p>
                  <Link href={`/employer/students/${a.name.toLowerCase().replace(" ", "-")}`}
                    className="text-xs text-brand-400 hover:text-brand-300">View profile →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active jobs */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">My listings</h2>
            <Link href="/employer/post-job" className="text-sm text-accent-400 hover:text-accent-300">+ Post new</Link>
          </div>
          <div className="space-y-3">
            {MY_JOBS.map((j) => (
              <div key={j.title} className="p-4 rounded-xl border border-surface-border hover:border-brand-500/20 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-sm font-medium text-[--text]">{j.title}</p>
                  <span className={`badge text-[10px] ${j.active ? "badge-green" : "badge-muted"}`}>
                    {j.active ? "Active" : "Closed"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="badge-blue text-[10px]">{j.type}</span>
                  <span className="text-xs text-[--text-muted]">{j.applications} applications</span>
                </div>
              </div>
            ))}
            <Link href="/employer/post-job" className="btn-primary w-full text-center text-sm">
              Post a new job
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
