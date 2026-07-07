"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Github, Linkedin, ExternalLink, CheckCircle, XCircle, Clock } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

// Mock applications for job id — replace with real fetch
const MOCK_APPLICATIONS = [
  {
    id: "a1", student: "Rafi Islam", username: "rafi-islam", university: "BUET",
    department: "CSE", path: "Web Dev", badges: 2, topBadge: "Mid-level ready",
    skills: ["React", "Node.js", "PostgreSQL"],
    github: "https://github.com/rafi", linkedin: "https://linkedin.com/in/rafi",
    appliedAt: "2h ago", status: "APPLIED", coverNote: "I've built 3 full-stack apps using React and Node.js and would love to contribute to your team.",
  },
  {
    id: "a2", student: "Sumaiya Khatun", username: "sumaiya", university: "SUST",
    department: "CSE", path: "Web Dev", badges: 1, topBadge: "Junior-ready",
    skills: ["React", "JavaScript", "Tailwind"],
    github: "https://github.com/sumaiya", linkedin: "",
    appliedAt: "5h ago", status: "APPLIED", coverNote: "",
  },
  {
    id: "a3", student: "Nabil Ahmed", username: "nabil", university: "IUT",
    department: "CSE", path: "Web Dev", badges: 3, topBadge: "Senior-ready",
    skills: ["Vue.js", "Laravel", "MySQL", "Docker"],
    github: "https://github.com/nabil", linkedin: "https://linkedin.com/in/nabil",
    appliedAt: "1d ago", status: "SHORTLISTED", coverNote: "Senior-track verified. Available immediately.",
  },
];

const STATUS_CONFIG: Record<string, { label: string; badge: string }> = {
  APPLIED:     { label: "Applied",     badge: "badge-blue" },
  REVIEWED:    { label: "Reviewed",    badge: "badge-muted" },
  SHORTLISTED: { label: "Shortlisted", badge: "badge-green" },
  REJECTED:    { label: "Rejected",    badge: "badge-red" },
  HIRED:       { label: "Hired 🎉",   badge: "badge-green" },
};

export default function JobApplicationsPage({ params }: { params: { id: string } }) {
  const [applications, setApplications] = useState(MOCK_APPLICATIONS);
  const [expanded, setExpanded] = useState<string | null>(null);
  const { toast } = useToast();

  function updateStatus(id: string, status: string) {
    setApplications((prev) =>
      prev.map((a) => a.id === id ? { ...a, status } : a)
    );
    const labels: Record<string, string> = {
      SHORTLISTED: "Applicant shortlisted",
      REJECTED: "Applicant rejected",
      HIRED: "Marked as hired — congrats!",
    };
    toast("success", labels[status] || "Status updated");
  }

  const counts = {
    total: applications.length,
    shortlisted: applications.filter((a) => a.status === "SHORTLISTED").length,
    hired: applications.filter((a) => a.status === "HIRED").length,
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div>
        <Link href="/employer/jobs" className="inline-flex items-center gap-1.5 text-sm text-[--text-muted] hover:text-[--text] mb-3">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to listings
        </Link>
        <h1 className="text-2xl font-display font-bold text-white">Applications</h1>
        <p className="text-[--text-muted] text-sm mt-1">Junior Frontend Developer</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total", value: counts.total, color: "text-brand-400" },
          { label: "Shortlisted", value: counts.shortlisted, color: "text-accent-400" },
          { label: "Hired", value: counts.hired, color: "text-yellow-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="card text-center py-4">
            <p className={`text-2xl font-bold font-display ${color}`}>{value}</p>
            <p className="text-xs text-[--text-muted] mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Application cards */}
      <div className="space-y-3">
        {applications.map((app) => {
          const sc = STATUS_CONFIG[app.status];
          const isOpen = expanded === app.id;

          return (
            <div key={app.id} className={`card transition-all ${isOpen ? "border-brand-500/20" : ""}`}>
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center text-brand-300 font-bold shrink-0">
                  {app.student[0]}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="font-semibold text-[--text]">{app.student}</p>
                    {app.badges > 0 && (
                      <span className="badge-green text-[10px] flex items-center gap-0.5">
                        <Shield className="w-2.5 h-2.5" />
                        {app.topBadge}
                      </span>
                    )}
                    <span className={`${sc.badge} text-[10px] ml-auto`}>{sc.label}</span>
                  </div>
                  <p className="text-xs text-[--text-muted]">
                    {app.university} · {app.department} · {app.path}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {app.skills.map((s) => (
                      <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-surface-muted text-[--text-muted]">{s}</span>
                    ))}
                  </div>
                </div>

                <p className="text-[10px] text-[--text-muted] shrink-0">{app.appliedAt}</p>
              </div>

              {/* Expanded */}
              {isOpen && (
                <div className="mt-4 pt-4 border-t border-surface-border space-y-4 animate-fade-in">
                  {app.coverNote && (
                    <div className="bg-surface-muted rounded-xl p-4">
                      <p className="text-xs text-[--text-muted] mb-1">Cover note</p>
                      <p className="text-sm text-[--text] leading-relaxed">"{app.coverNote}"</p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 flex-wrap">
                    <a href={`/u/${app.username}`} target="_blank"
                      className="btn-secondary text-xs flex items-center gap-1.5">
                      <ExternalLink className="w-3 h-3" /> Portfolio
                    </a>
                    {app.github && (
                      <a href={app.github} target="_blank"
                        className="btn-ghost text-xs flex items-center gap-1.5">
                        <Github className="w-3 h-3" /> GitHub
                      </a>
                    )}
                    {app.linkedin && (
                      <a href={app.linkedin} target="_blank"
                        className="btn-ghost text-xs flex items-center gap-1.5">
                        <Linkedin className="w-3 h-3" /> LinkedIn
                      </a>
                    )}
                  </div>

                  {/* Status actions */}
                  <div className="flex gap-2 flex-wrap">
                    {app.status !== "SHORTLISTED" && app.status !== "HIRED" && (
                      <button onClick={() => updateStatus(app.id, "SHORTLISTED")}
                        className="btn-primary text-xs flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5" /> Shortlist
                      </button>
                    )}
                    {app.status === "SHORTLISTED" && (
                      <button onClick={() => updateStatus(app.id, "HIRED")}
                        className="btn-primary text-xs flex items-center gap-1.5 bg-accent-500 hover:bg-accent-600">
                        🎉 Mark as hired
                      </button>
                    )}
                    {app.status !== "REJECTED" && app.status !== "HIRED" && (
                      <button onClick={() => updateStatus(app.id, "REJECTED")}
                        className="btn-danger text-xs flex items-center gap-1.5">
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    )}
                    {app.status === "REJECTED" && (
                      <button onClick={() => updateStatus(app.id, "APPLIED")}
                        className="btn-ghost text-xs">
                        Undo rejection
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Toggle */}
              <button onClick={() => setExpanded(isOpen ? null : app.id)}
                className="w-full text-center text-xs text-[--text-muted] hover:text-[--text] mt-3 pt-3 border-t border-surface-border transition-colors">
                {isOpen ? "Show less ↑" : "View details ↓"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
