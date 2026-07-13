"use client";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Loader2, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

const CAREER_PATHS = [
  { value: "WEB_DEV", label: "Web Development" },
  { value: "AI_ML", label: "AI / Machine Learning" },
  { value: "CYBERSECURITY", label: "Cybersecurity" },
  { value: "EMBEDDED_SYSTEMS", label: "Embedded Systems (EEE)" },
  { value: "DATA_SCIENCE", label: "Data Science" },
  { value: "UI_UX", label: "UI / UX Design" },
  { value: "DEVOPS", label: "DevOps / Cloud" },
];

const UNIVERSITIES = [
  "BUET", "KUET", "RUET", "CUET", "DUET",
  "Dhaka University", "BRAC University", "North South University",
  "IUT", "SUST", "JUST", "PUST", "MIST",
  "American International University Bangladesh",
  "Other",
];

type FormData = {
  name: string;
  email: string;
  password: string;
  username: string;
  university: string;
  department: string;
  graduationYear: string;
  careerPath: string;
};

const STEPS = ["Account", "Academic", "Career path"];

export default function StudentRegisterPage() {
  const [step, setStep] = useState(0);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormData>({
    name: "", email: "", password: "", username: "",
    university: "", department: "CSE", graduationYear: "",
    careerPath: "",
  });

  const update = (k: keyof FormData, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register/student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Registration failed"); setLoading(false); return; }
      window.location.href = "/dashboard";
    } catch {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md animate-fade-up">
      <div className="text-center mb-8">
        <Link href="/register" className="inline-flex items-center gap-1.5 text-sm text-[--text-muted] hover:text-[--text] mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </Link>
        <h1 className="text-2xl font-display font-bold text-white">Student Registration</h1>
        <p className="text-[--text-muted] mt-1 text-sm">Free for CSE and EEE students</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors
              ${i < step ? "bg-accent-500 text-white" : i === step ? "bg-brand-500 text-white" : "bg-surface-muted text-[--text-muted]"}`}>
              {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-xs ${i === step ? "text-[--text]" : "text-[--text-muted]"} hidden sm:block`}>{s}</span>
            {i < STEPS.length - 1 && <div className={`flex-1 h-px ${i < step ? "bg-accent-500" : "bg-surface-border"}`} />}
          </div>
        ))}
      </div>

      <div className="card">
        {/* Step 0 — Account */}
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <label className="label">Full name</label>
              <input className="input" placeholder="Iqtedar Hossain" value={form.name}
                onChange={(e) => update("name", e.target.value)} />
            </div>
            <div>
              <label className="label">Email address</label>
              <input className="input" type="email" placeholder="you@university.edu.bd" value={form.email}
                onChange={(e) => update("email", e.target.value)} />
            </div>
            <div>
              <label className="label">Username</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[--text-muted] text-sm">techc.app/u/</span>
                <input className="input pl-[7.5rem]" placeholder="iqtedar" value={form.username}
                  onChange={(e) => update("username", e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))} />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input className="input pr-10" type={showPw ? "text" : "password"} placeholder="Min. 8 characters"
                  value={form.password} onChange={(e) => update("password", e.target.value)} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[--text-muted] hover:text-[--text]">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 1 — Academic */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="label">University</label>
              <select className="select" value={form.university} onChange={(e) => update("university", e.target.value)}>
                <option value="">Select your university</option>
                {UNIVERSITIES.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Department</label>
              <div className="grid grid-cols-2 gap-3">
                {["CSE", "EEE"].map((dep) => (
                  <button key={dep} type="button"
                    onClick={() => update("department", dep)}
                    className={`py-3 rounded-xl border text-sm font-medium transition-all
                      ${form.department === dep
                        ? "bg-brand-500/10 border-brand-500/40 text-brand-300"
                        : "border-surface-border text-[--text-muted] hover:border-surface-muted"}`}>
                    {dep}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Expected graduation year</label>
              <select className="select" value={form.graduationYear} onChange={(e) => update("graduationYear", e.target.value)}>
                <option value="">Select year</option>
                {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() + i).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Step 2 — Career path */}
        {step === 2 && (
          <div className="space-y-3">
            <p className="text-sm text-[--text-muted] mb-1">Pick your primary career track — you can add more later.</p>
            {CAREER_PATHS.map((cp) => (
              <button key={cp.value} type="button"
                onClick={() => update("careerPath", cp.value)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm text-left transition-all
                  ${form.careerPath === cp.value
                    ? "bg-brand-500/10 border-brand-500/40 text-brand-300"
                    : "border-surface-border text-[--text-muted] hover:border-surface-muted"}`}>
                {form.careerPath === cp.value && <CheckCircle className="w-4 h-4 shrink-0" />}
                {form.careerPath !== cp.value && <div className="w-4 h-4 shrink-0 rounded-full border border-surface-border" />}
                {cp.label}
              </button>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mt-4">
            {error}
          </div>
        )}

        {/* Step navigation */}
        <div className="flex gap-3 mt-6">
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} className="btn-secondary flex-1 flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          )}
          {step < STEPS.length - 1 && (
            <button onClick={() => setStep(step + 1)} className="btn-primary flex-1 flex items-center justify-center gap-2">
              Next <ArrowRight className="w-4 h-4" />
            </button>
          )}
          {step === STEPS.length - 1 && (
            <button onClick={handleSubmit} disabled={loading || !form.careerPath}
              className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Creating account…" : "Create account"}
            </button>
          )}
        </div>
      </div>

      <p className="text-center text-xs text-[--text-muted] mt-4">
        Already registered?{" "}
        <Link href="/login" className="text-brand-400 hover:text-brand-300">Sign in</Link>
      </p>
    </div>
  );
}
