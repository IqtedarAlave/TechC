"use client";
import { useState } from "react";
import { Loader2, CheckCircle } from "lucide-react";

const CAREER_PATHS = [
  "WEB_DEV", "AI_ML", "CYBERSECURITY", "EMBEDDED_SYSTEMS", "DATA_SCIENCE", "UI_UX", "DEVOPS",
];
const PATH_LABELS: Record<string, string> = {
  WEB_DEV: "Web Development", AI_ML: "AI / Machine Learning",
  CYBERSECURITY: "Cybersecurity", EMBEDDED_SYSTEMS: "Embedded Systems",
  DATA_SCIENCE: "Data Science", UI_UX: "UI / UX Design", DEVOPS: "DevOps",
};

export default function PostJobPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", requirements: "",
    careerPath: "", jobType: "INTERNSHIP",
    salaryRange: "", location: "Dhaka", deadline: "",
  });

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-up">
        <div className="w-16 h-16 rounded-full bg-accent-500/20 flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-accent-400" />
        </div>
        <h2 className="text-xl font-display font-bold text-white mb-2">Job posted successfully</h2>
        <p className="text-[--text-muted] text-sm mb-6 max-w-sm">
          Your listing is live. Verified students matching your requirements will be able to apply.
        </p>
        <div className="flex gap-3">
          <a href="/employer/dashboard" className="btn-secondary">Back to dashboard</a>
          <button onClick={() => setSuccess(false)} className="btn-primary">Post another</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl animate-fade-up">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-white">Post a job</h1>
        <p className="text-[--text-muted] text-sm mt-1">Reach verified, project-tested students in Bangladesh</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label">Job title</label>
            <input className="input" placeholder="e.g. Junior Frontend Developer" value={form.title}
              onChange={(e) => update("title", e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Job type</label>
              <select className="select" value={form.jobType} onChange={(e) => update("jobType", e.target.value)}>
                <option value="INTERNSHIP">Internship</option>
                <option value="FULL_TIME">Full-time</option>
                <option value="PART_TIME">Part-time</option>
                <option value="CONTRACT">Contract</option>
              </select>
            </div>
            <div>
              <label className="label">Career track</label>
              <select className="select" value={form.careerPath} onChange={(e) => update("careerPath", e.target.value)} required>
                <option value="">Select track</option>
                {CAREER_PATHS.map((p) => <option key={p} value={p}>{PATH_LABELS[p]}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Location</label>
              <select className="select" value={form.location} onChange={(e) => update("location", e.target.value)}>
                <option value="Dhaka">Dhaka</option>
                <option value="Chittagong">Chittagong</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid (Dhaka)</option>
              </select>
            </div>
            <div>
              <label className="label">Salary / Stipend (BDT)</label>
              <input className="input" placeholder="e.g. 12,000–20,000 BDT" value={form.salaryRange}
                onChange={(e) => update("salaryRange", e.target.value)} />
            </div>
          </div>

          <div>
            <label className="label">Job description</label>
            <textarea className="input resize-none" rows={5}
              placeholder="What will the candidate work on? Day-to-day responsibilities, team structure, etc."
              value={form.description} onChange={(e) => update("description", e.target.value)} required />
          </div>

          <div>
            <label className="label">Requirements (one per line)</label>
            <textarea className="input resize-none" rows={4}
              placeholder={"Knowledge of React and Node.js\nBasic understanding of REST APIs\nFamiliar with Git"}
              value={form.requirements} onChange={(e) => update("requirements", e.target.value)} />
          </div>

          <div>
            <label className="label">Application deadline (optional)</label>
            <input className="input" type="date" value={form.deadline}
              onChange={(e) => update("deadline", e.target.value)} />
          </div>

          <div className="bg-surface-muted rounded-xl p-4 text-xs text-[--text-muted]">
            <p className="font-medium text-[--text] mb-1">Only TechC-verified students will see this listing</p>
            Students need at least one mentor-approved badge in the selected career track to apply directly.
            Others can express interest and will be notified when eligible.
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Publishing…" : "Publish job listing"}
          </button>
        </form>
      </div>
    </div>
  );
}
