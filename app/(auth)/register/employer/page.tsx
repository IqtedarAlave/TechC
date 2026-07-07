"use client";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";

const INDUSTRIES = [
  "Software / IT", "Fintech", "E-commerce", "Telecom",
  "Healthcare Tech", "EdTech", "NGO / Development", "Media & Creative",
  "Gaming", "Other",
];

const SIZES = ["1–10", "11–50", "51–200", "201–500", "500+"];

export default function EmployerRegisterPage() {
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", email: "", password: "",
    companyName: "", website: "", industry: "",
    size: "", location: "Dhaka", description: "",
  });

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/register/employer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Registration failed"); setLoading(false); return; }
      window.location.href = "/employer/dashboard";
    } catch {
      setError("Something went wrong."); setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-lg animate-fade-up">
      <div className="text-center mb-8">
        <Link href="/register" className="inline-flex items-center gap-1.5 text-sm text-[--text-muted] hover:text-[--text] mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </Link>
        <h1 className="text-2xl font-display font-bold text-white">Company Registration</h1>
        <p className="text-[--text-muted] mt-1 text-sm">Access verified student talent in Bangladesh</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Personal account */}
          <p className="text-xs font-medium text-[--text-muted] uppercase tracking-wider mb-1">Your account</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Your name</label>
              <input className="input" placeholder="Contact person" value={form.name}
                onChange={(e) => update("name", e.target.value)} required />
            </div>
            <div>
              <label className="label">Work email</label>
              <input className="input" type="email" placeholder="hr@company.com" value={form.email}
                onChange={(e) => update("email", e.target.value)} required />
            </div>
          </div>
          <div>
            <label className="label">Password</label>
            <div className="relative">
              <input className="input pr-10" type={showPw ? "text" : "password"} placeholder="Min. 8 characters"
                value={form.password} onChange={(e) => update("password", e.target.value)} required />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[--text-muted] hover:text-[--text]">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="divider" />

          {/* Company info */}
          <p className="text-xs font-medium text-[--text-muted] uppercase tracking-wider mb-1">Company details</p>
          <div>
            <label className="label">Company name</label>
            <input className="input" placeholder="Acme Technologies Ltd." value={form.companyName}
              onChange={(e) => update("companyName", e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Industry</label>
              <select className="select" value={form.industry} onChange={(e) => update("industry", e.target.value)} required>
                <option value="">Select industry</option>
                {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Team size</label>
              <select className="select" value={form.size} onChange={(e) => update("size", e.target.value)} required>
                <option value="">Select size</option>
                {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Website (optional)</label>
              <input className="input" placeholder="https://company.com" value={form.website}
                onChange={(e) => update("website", e.target.value)} />
            </div>
            <div>
              <label className="label">Location</label>
              <input className="input" placeholder="Dhaka, Bangladesh" value={form.location}
                onChange={(e) => update("location", e.target.value)} required />
            </div>
          </div>
          <div>
            <label className="label">About your company (optional)</label>
            <textarea className="input resize-none" rows={3}
              placeholder="Brief description of what you do and what kind of talent you're looking for..."
              value={form.description} onChange={(e) => update("description", e.target.value)} />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3">{error}</div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Creating account…" : "Create company account"}
          </button>

          <p className="text-center text-xs text-[--text-muted] mt-2">
            Your account will be reviewed within 24 hours before going live.
          </p>
        </form>
      </div>
    </div>
  );
}
