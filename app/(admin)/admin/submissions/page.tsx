"use client";
import { useState } from "react";
import { CheckCircle, XCircle, ExternalLink, ChevronDown, ChevronUp, Shield } from "lucide-react";

const SUBMISSIONS = [
  {
    id: "1", student: "Rafi Islam", university: "BUET", project: "REST API with Node.js",
    githubUrl: "https://github.com/rafi/rest-api", path: "Web Dev", difficulty: "Junior",
    status: "AI_REVIEWED", autoScore: 88, aiScore: 84, aiNotes: "Good code structure. Proper error handling. Missing input validation in some routes. README is clear.",
    submittedAt: "2024-06-10",
  },
  {
    id: "2", student: "Tasnim Akter", university: "NSU", project: "CNN Image Classifier",
    githubUrl: "https://github.com/tasnim/cnn-classifier", path: "AI/ML", difficulty: "Mid",
    status: "AI_REVIEWED", autoScore: 91, aiScore: 89, aiNotes: "Well-structured notebook. Training pipeline is clean. Eval metrics are thorough. Could add more comments.",
    submittedAt: "2024-06-11",
  },
  {
    id: "3", student: "Mehedi Hassan", university: "BRAC", project: "Portfolio Website",
    githubUrl: "https://github.com/mehedi/portfolio", path: "Web Dev", difficulty: "Junior",
    status: "AUTO_CHECKED", autoScore: 79, aiScore: null, aiNotes: null,
    submittedAt: "2024-06-12",
  },
];

const STAGE_CONFIG: Record<string, { label: string; badge: string }> = {
  AUTO_CHECKED: { label: "Needs AI review", badge: "badge-blue" },
  AI_REVIEWED:  { label: "Ready for mentor", badge: "badge-yellow" },
  MENTOR_APPROVED: { label: "Approved", badge: "badge-green" },
  REJECTED: { label: "Rejected", badge: "badge-red" },
};

export default function AdminSubmissionsPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const toggle = (id: string) => setExpanded(expanded === id ? null : id);

  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Submissions Review</h1>
        <p className="text-[--text-muted] text-sm mt-1">Mentor layer — approve or reject student project submissions</p>
      </div>

      {/* Filter strip */}
      <div className="flex gap-2 flex-wrap">
        {["All", "Needs AI review", "Ready for mentor", "Approved", "Rejected"].map((f) => (
          <button key={f} className={`btn-ghost text-xs px-3 py-1.5 ${f === "All" ? "bg-surface-muted text-[--text]" : ""}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {SUBMISSIONS.map((sub) => {
          const stage = STAGE_CONFIG[sub.status];
          const isOpen = expanded === sub.id;

          return (
            <div key={sub.id} className="card">
              {/* Header row */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center text-brand-300 font-bold shrink-0">
                  {sub.student[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <p className="font-semibold text-[--text]">{sub.project}</p>
                    <span className={`${stage.badge} text-[10px]`}>{stage.label}</span>
                  </div>
                  <p className="text-xs text-[--text-muted]">{sub.student} · {sub.university} · {sub.path} · {sub.difficulty}</p>
                </div>
                <button onClick={() => toggle(sub.id)} className="btn-ghost p-2">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Score strip */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className={`p-3 rounded-xl text-center ${sub.autoScore ? "bg-brand-500/10" : "bg-surface-muted"}`}>
                  <p className="text-xs text-[--text-muted] mb-1">Auto check</p>
                  <p className={`text-xl font-bold font-display ${sub.autoScore ? "text-brand-300" : "text-[--text-muted]"}`}>
                    {sub.autoScore ?? "—"}
                  </p>
                </div>
                <div className={`p-3 rounded-xl text-center ${sub.aiScore ? "bg-purple-500/10" : "bg-surface-muted"}`}>
                  <p className="text-xs text-[--text-muted] mb-1">AI review</p>
                  <p className={`text-xl font-bold font-display ${sub.aiScore ? "text-purple-300" : "text-[--text-muted]"}`}>
                    {sub.aiScore ?? "—"}
                  </p>
                </div>
                <div className="p-3 rounded-xl text-center bg-surface-muted">
                  <p className="text-xs text-[--text-muted] mb-1">Mentor</p>
                  <p className="text-[--text-muted] text-xl font-bold font-display">—</p>
                </div>
              </div>

              {/* Expanded details */}
              {isOpen && (
                <div className="mt-4 space-y-4 animate-fade-in">
                  <div className="flex gap-2">
                    <a href={sub.githubUrl} target="_blank" rel="noopener noreferrer"
                      className="btn-secondary text-sm flex items-center gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5" /> View GitHub repo
                    </a>
                  </div>

                  {sub.aiNotes && (
                    <div className="bg-surface-muted rounded-xl p-4">
                      <p className="text-xs font-medium text-purple-300 mb-2">AI review notes</p>
                      <p className="text-sm text-[--text-muted] leading-relaxed">{sub.aiNotes}</p>
                    </div>
                  )}

                  {sub.status === "AI_REVIEWED" && (
                    <div>
                      <label className="label">Mentor notes (required for approval or rejection)</label>
                      <textarea className="input resize-none" rows={3}
                        placeholder="What did you observe? What skills did the student demonstrate?"
                        value={notes[sub.id] || ""}
                        onChange={(e) => setNotes((n) => ({ ...n, [sub.id]: e.target.value }))} />

                      <div className="flex gap-3 mt-3">
                        <button className="btn-primary flex-1 flex items-center justify-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Approve &amp; issue badge
                        </button>
                        <button className="btn-danger flex items-center justify-center gap-2 px-5">
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    </div>
                  )}

                  {sub.status === "AUTO_CHECKED" && (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3">
                      <p className="text-sm text-blue-300">
                        This submission needs AI review before mentor evaluation. Trigger it from the submissions pipeline.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
