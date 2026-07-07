"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, ExternalLink, ChevronDown, ChevronUp, Shield, Loader2, Clock, AlertCircle } from "lucide-react";
import { CAREER_PATH_LABELS } from "@/lib/utils";

interface Submission {
  id: string;
  githubUrl: string;
  description: string | null;
  status: string;
  autoCheckScore: number | null;
  aiReviewScore: number | null;
  aiReviewNotes: string | null;
  mentorNotes: string | null;
  createdAt: string;
  student: {
    university: string;
    user: {
      name: string;
      email: string;
    };
  };
  project: {
    title: string;
    difficulty: string;
    roadmap: {
      path: string;
      title: string;
    };
  };
}

const STAGE_CONFIG: Record<string, { label: string; badge: string }> = {
  PENDING:          { label: "Pending auto check", badge: "badge-muted" },
  AUTO_CHECKED:     { label: "Needs AI review",    badge: "badge-blue" },
  AI_REVIEWED:      { label: "Ready for mentor",   badge: "badge-yellow" },
  MENTOR_APPROVED:  { label: "Approved",           badge: "badge-green" },
  REJECTED:         { label: "Rejected",           badge: "badge-red" },
};

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState("All");
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const loadSubmissions = async () => {
    try {
      const res = await fetch("/api/admin/submissions");
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.submissions || []);
      }
    } catch (err) {
      console.error("Error loading submissions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const toggle = (id: string) => setExpanded(expanded === id ? null : id);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    const mentorNotes = notes[id] || "";
    if (mentorNotes.trim().length < 10) {
      alert("Mentor notes must be at least 10 characters long.");
      return;
    }

    setSubmittingId(id);
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action, mentorNotes }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to submit review");
      }

      // Re-fetch submissions list
      await loadSubmissions();
      setExpanded(null);
    } catch (err: any) {
      alert(err.message || "An error occurred while submitting review.");
    } finally {
      setSubmittingId(null);
    }
  };

  const filteredSubmissions = submissions.filter((sub) => {
    if (filter === "All") return true;
    if (filter === "Needs AI review") return sub.status === "AUTO_CHECKED" || sub.status === "PENDING";
    if (filter === "Ready for mentor") return sub.status === "AI_REVIEWED";
    if (filter === "Approved") return sub.status === "MENTOR_APPROVED";
    if (filter === "Rejected") return sub.status === "REJECTED";
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Submissions Review</h1>
        <p className="text-[--text-muted] text-sm mt-1">Mentor layer — approve or reject student project submissions</p>
      </div>

      {/* Filter strip */}
      <div className="flex gap-2 flex-wrap">
        {["All", "Needs AI review", "Ready for mentor", "Approved", "Rejected"].map((f) => (
          <button 
            key={f} 
            onClick={() => setFilter(f)}
            className={`btn-ghost text-xs px-3 py-1.5 rounded-lg transition-colors ${f === filter ? "bg-brand-500/20 text-brand-300 font-semibold" : "text-[--text-muted]"}`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-[--text-muted]">
          <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
          <p className="text-sm">Loading submissions...</p>
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <div className="card text-center py-12 text-[--text-muted] border-dashed border-slate-700">
          <p className="text-sm">No submissions found matching this category.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSubmissions.map((sub) => {
            const stage = STAGE_CONFIG[sub.status] || { label: sub.status, badge: "badge-muted" };
            const isOpen = expanded === sub.id;
            const pathLabel = CAREER_PATH_LABELS[sub.project.roadmap.path] || sub.project.roadmap.title;

            return (
              <div key={sub.id} className="card hover:border-surface-border transition-colors animate-fade-in">
                {/* Header row */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center text-brand-300 font-bold shrink-0">
                    {sub.student.user.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <p className="font-semibold text-[--text]">{sub.project.title}</p>
                      <span className={`${stage.badge} text-[10px]`}>{stage.label}</span>
                    </div>
                    <p className="text-xs text-[--text-muted]">{sub.student.user.name} · {sub.student.university} · {pathLabel} · <span className="uppercase">{sub.project.difficulty}</span></p>
                  </div>
                  <button onClick={() => toggle(sub.id)} className="btn-ghost p-2">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Score strip */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className={`p-3 rounded-xl text-center ${sub.autoCheckScore ? "bg-brand-500/10" : "bg-surface-muted"}`}>
                    <p className="text-xs text-[--text-muted] mb-1">Auto check</p>
                    <p className={`text-xl font-bold font-display ${sub.autoCheckScore ? "text-brand-300" : "text-[--text-muted]"}`}>
                      {sub.autoCheckScore ?? "—"}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl text-center ${sub.aiReviewScore ? "bg-purple-500/10" : "bg-surface-muted"}`}>
                    <p className="text-xs text-[--text-muted] mb-1">AI review</p>
                    <p className={`text-xl font-bold font-display ${sub.aiReviewScore ? "text-purple-300" : "text-[--text-muted]"}`}>
                      {sub.aiReviewScore ?? "—"}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl text-center bg-surface-muted">
                    <p className="text-xs text-[--text-muted] mb-1">Mentor</p>
                    <p className="text-[--text-muted] text-xl font-bold font-display">—</p>
                  </div>
                </div>

                {/* Expanded details */}
                {isOpen && (
                  <div className="mt-4 space-y-4 animate-fade-in border-t border-surface-border pt-4">
                    <div className="flex gap-2">
                      <a href={sub.githubUrl} target="_blank" rel="noopener noreferrer"
                        className="btn-secondary text-sm flex items-center gap-1.5">
                        <ExternalLink className="w-3.5 h-3.5" /> View GitHub repo
                      </a>
                    </div>

                    {sub.description && (
                      <div className="bg-surface-muted rounded-xl p-4">
                        <p className="text-xs font-medium text-[--text-muted] mb-2">Student notes</p>
                        <p className="text-sm text-[--text] leading-relaxed">{sub.description}</p>
                      </div>
                    )}

                    {sub.aiReviewNotes && (
                      <div className="bg-surface-muted rounded-xl p-4">
                        <p className="text-xs font-medium text-purple-300 mb-2">AI review notes</p>
                        <p className="text-sm text-[--text-muted] leading-relaxed whitespace-pre-wrap">{sub.aiReviewNotes}</p>
                      </div>
                    )}

                    {sub.status === "AI_REVIEWED" && (
                      <div>
                        <label className="label">Mentor notes (required for approval or rejection - min 10 chars)</label>
                        <textarea className="input resize-none" rows={3}
                          placeholder="What did you observe? What skills did the student demonstrate?"
                          value={notes[sub.id] || ""}
                          onChange={(e) => setNotes((n) => ({ ...n, [sub.id]: e.target.value }))} />

                        <div className="flex gap-3 mt-3">
                          <button 
                            onClick={() => handleAction(sub.id, "approve")}
                            disabled={submittingId === sub.id}
                            className="btn-primary flex-1 flex items-center justify-center gap-2"
                          >
                            {submittingId === sub.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                            Approve &amp; issue badge
                          </button>
                          <button 
                            onClick={() => handleAction(sub.id, "reject")}
                            disabled={submittingId === sub.id}
                            className="btn-danger flex items-center justify-center gap-2 px-5"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </div>
                      </div>
                    )}

                    {sub.status === "AUTO_CHECKED" && (
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3">
                        <p className="text-sm text-blue-300">
                          This submission needs AI review before mentor evaluation. Run the automated review background jobs to trigger it.
                        </p>
                      </div>
                    )}
                    
                    {(sub.status === "MENTOR_APPROVED" || sub.status === "REJECTED") && (
                      <div className="bg-surface-muted rounded-xl p-4 border border-surface-border">
                        <p className="text-xs font-medium text-[--text-muted] mb-1">Mentor Evaluation Notes</p>
                        <p className="text-sm text-[--text] leading-relaxed italic">&quot;{sub.mentorNotes || "No mentor notes provided."}&quot;</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
