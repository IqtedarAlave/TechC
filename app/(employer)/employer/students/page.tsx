"use client";
import { useState } from "react";
import { Shield, Search, GraduationCap, ExternalLink, Github, Linkedin, SlidersHorizontal } from "lucide-react";

const STUDENTS = [
  {
    id: "1", name: "Rafi Islam", username: "rafi-islam", university: "BUET",
    department: "CSE", graduationYear: 2025, careerPath: "Web Dev",
    skills: ["React", "Node.js", "PostgreSQL", "TypeScript"],
    badges: 2, topBadge: "Mid-level ready", isPublic: true,
    githubUrl: "https://github.com/rafi", linkedinUrl: "https://linkedin.com/in/rafi",
  },
  {
    id: "2", name: "Tasnim Akter", username: "tasnim", university: "NSU",
    department: "CSE", graduationYear: 2024, careerPath: "AI/ML",
    skills: ["Python", "TensorFlow", "Pandas", "scikit-learn"],
    badges: 1, topBadge: "Junior-ready", isPublic: true,
    githubUrl: "https://github.com/tasnim", linkedinUrl: "",
  },
  {
    id: "3", name: "Sumaiya Khatun", username: "sumaiya", university: "SUST",
    department: "CSE", graduationYear: 2025, careerPath: "DevOps",
    skills: ["Docker", "GitHub Actions", "Linux", "AWS"],
    badges: 2, topBadge: "Mid-level ready", isPublic: true,
    githubUrl: "https://github.com/sumaiya", linkedinUrl: "https://linkedin.com/in/sumaiya",
  },
  {
    id: "4", name: "Arif Hossain", username: "arif", university: "KUET",
    department: "EEE", graduationYear: 2025, careerPath: "Embedded Systems",
    skills: ["C", "Arduino", "FPGA", "Embedded C"],
    badges: 1, topBadge: "Junior-ready", isPublic: true,
    githubUrl: "https://github.com/arif", linkedinUrl: "",
  },
  {
    id: "5", name: "Mehjabin Rahman", username: "mehjabin", university: "BRAC",
    department: "CSE", graduationYear: 2026, careerPath: "UI/UX",
    skills: ["Figma", "React", "HTML/CSS", "Tailwind CSS"],
    badges: 1, topBadge: "Junior-ready", isPublic: true,
    githubUrl: "https://github.com/mehjabin", linkedinUrl: "https://linkedin.com/in/mehjabin",
  },
  {
    id: "6", name: "Nabil Ahmed", username: "nabil", university: "IUT",
    department: "CSE", graduationYear: 2025, careerPath: "Web Dev",
    skills: ["Vue.js", "Laravel", "MySQL", "REST API"],
    badges: 3, topBadge: "Senior-ready", isPublic: true,
    githubUrl: "https://github.com/nabil", linkedinUrl: "https://linkedin.com/in/nabil",
  },
];

const PATHS = ["All", "Web Dev", "AI/ML", "Cybersecurity", "Embedded Systems", "DevOps", "UI/UX"];
const BADGE_FILTERS = ["Any", "1+ badges", "2+ badges", "3+ badges"];
const DEPT_FILTERS = ["All depts", "CSE", "EEE"];

export default function TalentBrowserPage() {
  const [search, setSearch] = useState("");
  const [pathFilter, setPathFilter] = useState("All");
  const [badgeFilter, setBadgeFilter] = useState("Any");
  const [deptFilter, setDeptFilter] = useState("All depts");
  const [shortlisted, setShortlisted] = useState<Set<string>>(new Set());

  const filtered = STUDENTS.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch = s.name.toLowerCase().includes(q) ||
      s.skills.some((sk) => sk.toLowerCase().includes(q)) ||
      s.university.toLowerCase().includes(q);
    const matchPath = pathFilter === "All" || s.careerPath === pathFilter;
    const matchBadge = badgeFilter === "Any" ||
      (badgeFilter === "1+ badges" && s.badges >= 1) ||
      (badgeFilter === "2+ badges" && s.badges >= 2) ||
      (badgeFilter === "3+ badges" && s.badges >= 3);
    const matchDept = deptFilter === "All depts" || s.department === deptFilter;
    return matchSearch && matchPath && matchBadge && matchDept;
  });

  function toggleShortlist(id: string) {
    setShortlisted((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Browse Talent</h1>
          <p className="text-[--text-muted] text-sm mt-1">
            {STUDENTS.length} verified students · filter by skill, path, and badge level
          </p>
        </div>
        {shortlisted.size > 0 && (
          <div className="badge-yellow flex items-center gap-1.5 px-3 py-2">
            <Shield className="w-3.5 h-3.5" />
            {shortlisted.size} shortlisted
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[--text-muted]" />
          <input className="input pl-9" placeholder="Search by name, skill, or university…"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="flex flex-wrap gap-2">
          {PATHS.map((f) => (
            <button key={f} onClick={() => setPathFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-xl border font-medium transition-all
                ${pathFilter === f ? "bg-brand-500/10 border-brand-500/30 text-brand-300"
                  : "border-surface-border text-[--text-muted] hover:border-surface-muted"}`}>
              {f}
            </button>
          ))}
          <span className="w-px bg-surface-border" />
          {BADGE_FILTERS.map((f) => (
            <button key={f} onClick={() => setBadgeFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-xl border font-medium transition-all
                ${badgeFilter === f ? "bg-accent-500/10 border-accent-500/30 text-accent-300"
                  : "border-surface-border text-[--text-muted] hover:border-surface-muted"}`}>
              {f}
            </button>
          ))}
          <span className="w-px bg-surface-border" />
          {DEPT_FILTERS.map((f) => (
            <button key={f} onClick={() => setDeptFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-xl border font-medium transition-all
                ${deptFilter === f ? "bg-purple-500/10 border-purple-500/30 text-purple-300"
                  : "border-surface-border text-[--text-muted] hover:border-surface-muted"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-[--text-muted]">
        {filtered.length} student{filtered.length !== 1 ? "s" : ""} found
      </p>

      {/* Student cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.length === 0 && (
          <div className="col-span-2 card text-center py-12">
            <SlidersHorizontal className="w-8 h-8 mx-auto mb-3 text-[--text-muted] opacity-40" />
            <p className="text-[--text-muted] text-sm">No students match your filters.</p>
          </div>
        )}

        {filtered.map((s) => (
          <div key={s.id} className="card-hover flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center text-brand-300 font-bold shrink-0">
                  {s.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-[--text]">{s.name}</p>
                  <p className="text-xs text-[--text-muted]">{s.university} · {s.department}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Shield className="w-3.5 h-3.5 text-accent-400" />
                <span className="text-xs font-medium text-accent-300">{s.badges} badge{s.badges !== 1 ? "s" : ""}</span>
              </div>
            </div>

            {/* Badge level + path */}
            <div className="flex items-center gap-2">
              <span className="badge-green text-[10px]">{s.topBadge}</span>
              <span className="badge-blue text-[10px]">{s.careerPath}</span>
              <span className="badge-muted text-[10px]">Class of {s.graduationYear}</span>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-1.5">
              {s.skills.map((sk) => (
                <span key={sk} className="text-[10px] px-2 py-0.5 rounded-lg bg-surface-muted text-[--text-muted]">{sk}</span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-auto pt-2 border-t border-surface-border">
              <a href={`/u/${s.username}`} target="_blank"
                className="btn-secondary text-xs flex items-center gap-1.5 flex-1 justify-center">
                <ExternalLink className="w-3 h-3" /> View portfolio
              </a>
              {s.githubUrl && (
                <a href={s.githubUrl} target="_blank"
                  className="w-8 h-8 rounded-lg bg-surface-muted flex items-center justify-center text-[--text-muted] hover:text-[--text] transition-colors">
                  <Github className="w-3.5 h-3.5" />
                </a>
              )}
              {s.linkedinUrl && (
                <a href={s.linkedinUrl} target="_blank"
                  className="w-8 h-8 rounded-lg bg-surface-muted flex items-center justify-center text-[--text-muted] hover:text-[--text] transition-colors">
                  <Linkedin className="w-3.5 h-3.5" />
                </a>
              )}
              <button onClick={() => toggleShortlist(s.id)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors text-xs font-bold
                  ${shortlisted.has(s.id)
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-surface-muted text-[--text-muted] hover:text-yellow-400"}`}
                title={shortlisted.has(s.id) ? "Remove from shortlist" : "Add to shortlist"}>
                ★
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
