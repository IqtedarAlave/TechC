"use client";
import { useState } from "react";
import { MapPin, Clock, Banknote, Building2, Shield, Lock, ArrowRight, Search, SlidersHorizontal } from "lucide-react";

const JOBS = [
  {
    id: "1", title: "Junior Frontend Developer", company: "Shajgoj Tech", location: "Dhaka",
    type: "Full-time", path: "WEB_DEV", pathLabel: "Web Dev", salary: "20,000–30,000 BDT",
    deadline: "Jun 30", verified: true, requiresBadge: true,
    skills: ["React", "Tailwind", "REST API"],
    description: "Join our product team building Bangladesh's largest beauty e-commerce platform. You'll own features end-to-end.",
  },
  {
    id: "2", title: "React Intern", company: "Acme Technologies", location: "Remote",
    type: "Internship", path: "WEB_DEV", pathLabel: "Web Dev", salary: "12,000–15,000 BDT",
    deadline: "Jul 5", verified: true, requiresBadge: false,
    skills: ["React", "JavaScript", "Git"],
    description: "3-month internship with real product work. Strong performers get a return offer.",
  },
  {
    id: "3", title: "ML Engineer Intern", company: "Maya Technologies", location: "Dhaka",
    type: "Internship", path: "AI_ML", pathLabel: "AI/ML", salary: "15,000 BDT",
    deadline: "Jul 10", verified: true, requiresBadge: true,
    skills: ["Python", "TensorFlow", "Pandas"],
    description: "Work on our health AI models. You'll ship real code to production on day one.",
  },
  {
    id: "4", title: "Node.js Backend Intern", company: "10 Minute School", location: "Hybrid",
    type: "Internship", path: "WEB_DEV", pathLabel: "Web Dev", salary: "12,000 BDT",
    deadline: "Jul 15", verified: false, requiresBadge: false,
    skills: ["Node.js", "PostgreSQL", "REST"],
    description: "Build APIs for Bangladesh's largest ed-tech platform. Over 5M registered users.",
  },
  {
    id: "5", title: "DevOps Intern", company: "Shajgoj Tech", location: "Dhaka",
    type: "Internship", path: "DEVOPS", pathLabel: "DevOps", salary: "14,000 BDT",
    deadline: "Jul 20", verified: true, requiresBadge: true,
    skills: ["Docker", "GitHub Actions", "Linux"],
    description: "Maintain and improve our CI/CD pipelines and cloud infrastructure on AWS.",
  },
];

const TYPE_BADGE: Record<string, string> = {
  "Full-time":  "badge-blue",
  "Internship": "badge-yellow",
  "Part-time":  "badge-muted",
  "Contract":   "badge-muted",
};

const FILTERS = ["All", "Web Dev", "AI/ML", "Cybersecurity", "DevOps", "Embedded Systems"];
const TYPE_FILTERS = ["Any type", "Internship", "Full-time", "Remote"];

// Mock: student has one badge
const STUDENT_HAS_BADGE = true;

export default function JobsPage() {
  const [search, setSearch] = useState("");
  const [pathFilter, setPathFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("Any type");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [applied, setApplied] = useState<Set<string>>(new Set());

  const filtered = JOBS.filter((j) => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase());
    const matchPath = pathFilter === "All" || j.pathLabel === pathFilter;
    const matchType = typeFilter === "Any type" || j.type === typeFilter ||
      (typeFilter === "Remote" && j.location === "Remote");
    return matchSearch && matchPath && matchType;
  });

  function handleApply(id: string) {
    setApplied((prev) => new Set([...Array.from(prev), id]));
  }

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Jobs & Internships</h1>
        <p className="text-[--text-muted] text-sm mt-1">
          {JOBS.length} verified listings · matched to your career track
        </p>
      </div>

      {/* Badge warning */}
      {!STUDENT_HAS_BADGE && (
        <div className="card border-yellow-500/20 bg-yellow-500/5 flex items-center gap-3">
          <Lock className="w-5 h-5 text-yellow-400 shrink-0" />
          <div>
            <p className="text-sm font-medium text-yellow-300">Some listings require a TechC badge</p>
            <p className="text-xs text-[--text-muted] mt-0.5">
              Earn your first mentor-approved badge to unlock direct applications.{" "}
              <a href="/projects" className="text-yellow-400 underline">Submit a project →</a>
            </p>
          </div>
        </div>
      )}

      {/* Search + filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[--text-muted]" />
          <input className="input pl-9" placeholder="Search job title or company…"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setPathFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-xl border transition-all font-medium
                ${pathFilter === f
                  ? "bg-brand-500/10 border-brand-500/30 text-brand-300"
                  : "border-surface-border text-[--text-muted] hover:border-surface-muted"}`}>
              {f}
            </button>
          ))}
          <div className="w-px bg-surface-border mx-1" />
          {TYPE_FILTERS.map((f) => (
            <button key={f} onClick={() => setTypeFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-xl border transition-all font-medium
                ${typeFilter === f
                  ? "bg-purple-500/10 border-purple-500/30 text-purple-300"
                  : "border-surface-border text-[--text-muted] hover:border-surface-muted"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-[--text-muted]">
        {filtered.length} listing{filtered.length !== 1 ? "s" : ""}
        {pathFilter !== "All" ? ` in ${pathFilter}` : ""}
      </p>

      {/* Job cards */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="card text-center py-12 text-[--text-muted]">
            <SlidersHorizontal className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p>No listings match your filters.</p>
          </div>
        )}

        {filtered.map((job) => {
          const canApply = !job.requiresBadge || STUDENT_HAS_BADGE;
          const isExpanded = expanded === job.id;
          const hasApplied = applied.has(job.id);

          return (
            <div key={job.id} className={`card transition-all duration-200 ${isExpanded ? "border-brand-500/20" : "hover:border-brand-500/10"}`}>
              {/* Top row */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 flex items-center justify-center text-brand-300 font-bold text-lg shrink-0">
                    {job.company[0]}
                  </div>
                  <div>
                    <h2 className="font-semibold text-white">{job.title}</h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-sm text-[--text-muted]">{job.company}</p>
                      {job.verified && (
                        <span className="badge-green text-[10px] flex items-center gap-0.5">
                          <Shield className="w-2.5 h-2.5" /> Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <span className={`${TYPE_BADGE[job.type]} shrink-0`}>{job.type}</span>
              </div>

              {/* Meta */}
              <div className="flex flex-wrap gap-3 text-xs text-[--text-muted] mb-3">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                <span className="flex items-center gap-1"><Banknote className="w-3 h-3" />{job.salary}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Deadline: {job.deadline}</span>
                <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{job.pathLabel}</span>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {job.skills.map((s) => <span key={s} className="badge-muted text-[10px]">{s}</span>)}
                {job.requiresBadge && (
                  <span className="badge-green text-[10px] flex items-center gap-1">
                    <Shield className="w-2.5 h-2.5" />Badge required
                  </span>
                )}
              </div>

              {/* Expand/collapse description */}
              {isExpanded && (
                <div className="mb-4 animate-fade-in">
                  <p className="text-sm text-[--text] leading-relaxed bg-surface-muted rounded-xl p-4">
                    {job.description}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3">
                {hasApplied ? (
                  <span className="badge-green flex items-center gap-1 px-4 py-2">
                    <Shield className="w-3 h-3" /> Applied
                  </span>
                ) : canApply ? (
                  <button onClick={() => handleApply(job.id)}
                    className="btn-primary text-sm flex items-center gap-1.5">
                    Apply now <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button disabled
                    className="btn-secondary text-sm flex items-center gap-1.5 opacity-50 cursor-not-allowed">
                    <Lock className="w-3.5 h-3.5" /> Badge required
                  </button>
                )}
                <button onClick={() => setExpanded(isExpanded ? null : job.id)}
                  className="btn-ghost text-sm">
                  {isExpanded ? "Show less" : "View details"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
