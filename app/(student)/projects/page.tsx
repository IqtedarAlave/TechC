"use client";

import { useState, useEffect } from "react";
import { GitBranch, Upload, CheckCircle, Clock, AlertCircle, ExternalLink, Loader2 } from "lucide-react";

interface Submission {
  id: string;
  projectId: string;
  githubUrl: string;
  description: string | null;
  status: string;
  autoCheckScore: number | null;
  aiReviewScore: number | null;
  badgeUid: string | null;
  createdAt: string;
  project: {
    title: string;
    difficulty: string;
    roadmap: {
      title: string;
    };
  };
}

interface RoadmapProject {
  id: string;
  title: string;
  difficulty: string;
  skills: string[];
}

const STATUS_CONFIG: Record<string, { label: string; badge: string; icon: React.ReactNode; desc: string }> = {
  PENDING:         { label: "Checking...",   badge: "badge-muted animate-pulse",  icon: <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-400" />, desc: "Automated check in progress..." },
  AUTO_CHECKED:    { label: "Auto checked",  badge: "badge-blue",   icon: <CheckCircle className="w-3.5 h-3.5" />, desc: "Passed automated check. Queued for AI review." },
  AI_REVIEWED:     { label: "AI reviewed",   badge: "badge-yellow", icon: <CheckCircle className="w-3.5 h-3.5" />, desc: "AI review complete. Awaiting mentor." },
  MENTOR_APPROVED: { label: "✓ Verified",   badge: "badge-green",  icon: <CheckCircle className="w-3.5 h-3.5" />, desc: "Mentor approved. Badge issued." },
  REJECTED:        { label: "Rejected",      badge: "badge-red",    icon: <AlertCircle className="w-3.5 h-3.5" />, desc: "Submission rejected. See notes." },
};

export default function ProjectsPage() {
  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [description, setDescription] = useState("");
  
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [roadmapProjects, setRoadmapProjects] = useState<RoadmapProject[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const [subRes, rmRes] = await Promise.all([
        fetch("/api/submissions"),
        fetch("/api/roadmap"),
      ]);
      
      if (subRes.ok) {
        const subData = await subRes.json();
        setSubmissions(subData.submissions || []);
      }
      
      if (rmRes.ok) {
        const rmData = await rmRes.json();
        if (rmData.roadmap && rmData.roadmap.projects) {
          // Filter out already submitted projects from the dropdown options
          setRoadmapProjects(rmData.roadmap.projects);
        }
      }
    } catch (err) {
      console.error("Error loading projects data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const hasTransitional = submissions.some(
      (sub) => sub.status === "PENDING" || sub.status === "AUTO_CHECKED"
    );

    if (!hasTransitional) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/submissions");
        if (res.ok) {
          const data = await res.json();
          setSubmissions(data.submissions || []);
        }
      } catch (err) {
        console.error("Error polling submissions status:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [submissions]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: selectedProject,
          githubUrl,
          description,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to submit project");
      }

      setSuccess(true);
      setShowForm(false);
      setGithubUrl("");
      setDescription("");
      setSelectedProject("");
      
      // Refresh listings
      await loadData();
      
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || "An error occurred while submitting.");
    } finally {
      setSubmitting(false);
    }
  }

  // Filter out roadmap projects that have already been submitted
  const submittedProjectIds = submissions.map((s) => s.projectId);
  const availableProjects = roadmapProjects.filter((p) => !submittedProjectIds.includes(p.id));

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Projects</h1>
          <p className="text-[--text-muted] text-sm mt-1">Submit your GitHub repos. Get validated.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Submit project
        </button>
      </div>

      {/* Success banner */}
      {success && (
        <div className="card border-accent-500/30 bg-accent-500/5 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-accent-400 shrink-0" />
          <p className="text-sm text-accent-300">Project submitted! Automated review usually takes a few minutes.</p>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="card border-red-500/30 bg-red-500/5 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* Submission form */}
      {showForm && (
        <div className="card border-brand-500/30 animate-fade-up">
          <h2 className="section-title mb-1">New project submission</h2>
          <p className="section-subtitle mb-5">Paste your GitHub repo link. We handle the rest.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Select roadmap project</label>
              <select className="select" value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} required>
                <option value="">Choose a project from your roadmap</option>
                {availableProjects.map((p) => (
                  <option key={p.id} value={p.id}>{p.title} — {p.difficulty}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">GitHub repository URL</label>
              <div className="relative">
                <GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[--text-muted]" />
                <input className="input pl-9" type="url" placeholder="https://github.com/username/repo-name"
                  value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} required />
              </div>
              <p className="text-xs text-[--text-muted] mt-1">
                Repository must be public. README and commit history will be analyzed.
              </p>
            </div>
            <div>
              <label className="label">Brief description (optional)</label>
              <textarea className="input resize-none" rows={3}
                placeholder="What did you build? Any challenges you solved?"
                value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            {/* Validation steps preview */}
            <div className="bg-surface-muted rounded-xl p-4">
              <p className="text-xs font-medium text-[--text-muted] mb-3">What happens after you submit</p>
              <div className="space-y-2">
                {[
                  { step: "1", label: "Automated check", desc: "Repo structure, README, commits, code quality" },
                  { step: "2", label: "AI code review", desc: "Originality, depth, best practices" },
                  { step: "3", label: "Mentor approval", desc: "Human review + badge with verifiable UID" },
                ].map((s) => (
                  <div key={s.step} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-300 text-xs flex items-center justify-center shrink-0 mt-0.5">{s.step}</span>
                    <div>
                      <span className="text-xs font-medium text-[--text]">{s.label}</span>
                      <span className="text-xs text-[--text-muted] ml-1.5">— {s.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
              <button type="submit" disabled={submitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {submitting ? "Submitting…" : "Submit for review"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Submissions list */}
      <div className="space-y-4">
        <h2 className="section-title">My submissions</h2>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-[--text-muted]">
            <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
            <p className="text-sm">Loading submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="card text-center py-12 text-[--text-muted] border-dashed border-slate-700">
            <p className="text-sm">You haven&apos;t submitted any projects yet.</p>
            <button onClick={() => setShowForm(true)} className="btn-secondary text-xs mt-3">Submit your first project</button>
          </div>
        ) : (
          submissions.map((sub) => {
            const s = STATUS_CONFIG[sub.status] || {
              label: sub.status,
              badge: "badge-muted",
              icon: <Clock className="w-3.5 h-3.5" />,
              desc: "Unknown status",
            };
            return (
              <div key={sub.id} className="card hover:border-brand-500/20 transition-colors animate-fade-in">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400">
                      <GitBranch className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-[--text]">{sub.project.title}</p>
                      <a href={sub.githubUrl} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-[--text-muted] hover:text-brand-400 flex items-center gap-1 mt-0.5">
                        {sub.githubUrl.replace("https://github.com/", "github.com/")}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                  <span className={`${s.badge} flex items-center gap-1`}>{s.icon} {s.label}</span>
                </div>

                 {/* Validation progress */}
                <div className="grid grid-cols-3 gap-3">
                  <div className={`p-3 rounded-xl text-center transition-all ${sub.status === "PENDING" ? "bg-brand-500/5 animate-pulse border border-brand-500/20" : sub.autoCheckScore ? "bg-brand-500/10" : "bg-surface-muted"}`}>
                    <p className="text-xs text-[--text-muted] mb-1">Auto check</p>
                    {sub.status === "PENDING" ? (
                      <div className="flex justify-center items-center h-8">
                        <Loader2 className="w-5 h-5 animate-spin text-brand-400" />
                      </div>
                    ) : (
                      <>
                        <p className={`text-lg font-bold font-display ${sub.autoCheckScore ? "text-brand-300" : "text-[--text-muted]"}`}>
                          {sub.autoCheckScore ? `${sub.autoCheckScore}` : "—"}
                        </p>
                        {sub.autoCheckScore && <p className="text-[10px] text-[--text-muted]">/100</p>}
                      </>
                    )}
                  </div>
                  <div className={`p-3 rounded-xl text-center ${sub.aiReviewScore ? "bg-purple-500/10" : "bg-surface-muted"}`}>
                    <p className="text-xs text-[--text-muted] mb-1">AI review</p>
                    <p className={`text-lg font-bold font-display ${sub.aiReviewScore ? "text-purple-300" : "text-[--text-muted]"}`}>
                      {sub.aiReviewScore ? `${sub.aiReviewScore}` : "—"}
                    </p>
                    {sub.aiReviewScore && <p className="text-[10px] text-[--text-muted]">/100</p>}
                  </div>
                  <div className={`p-3 rounded-xl text-center ${sub.badgeUid ? "bg-accent-500/10" : "bg-surface-muted"}`}>
                    <p className="text-xs text-[--text-muted] mb-1">Mentor badge</p>
                    {sub.badgeUid ? (
                      <p className="text-accent-400 text-xs font-mono break-all">{sub.badgeUid}</p>
                    ) : (
                      <p className="text-[--text-muted] text-lg font-bold">—</p>
                    )}
                  </div>
                </div>

                <p className="text-xs text-[--text-muted] mt-3">{s.desc}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
