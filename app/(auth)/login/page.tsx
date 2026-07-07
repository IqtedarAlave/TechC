"use client";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: fd.get("email"),
          password: fd.get("password"),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Login failed"); setLoading(false); return; }

      // Redirect by role
      if (data.role === "STUDENT") window.location.href = "/dashboard";
      else if (data.role === "EMPLOYER") window.location.href = "/employer/dashboard";
      else if (data.role === "ADMIN") window.location.href = "/admin/dashboard";
    } catch {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md animate-fade-up">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-display font-bold text-white">Welcome back</h1>
        <p className="text-[--text-muted] mt-1 text-sm">Sign in to your TechC account</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label" htmlFor="email">Email address</label>
            <input
              id="email" name="email" type="email" required
              placeholder="you@university.edu.bd"
              className="input"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="label mb-0" htmlFor="password">Password</label>
              <Link href="/forgot-password" className="text-xs text-brand-400 hover:text-brand-300">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password" name="password"
                type={showPw ? "text" : "password"}
                required placeholder="••••••••"
                className="input pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[--text-muted] hover:text-[--text]"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="divider" />

        <p className="text-center text-sm text-[--text-muted]">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-brand-400 hover:text-brand-300 font-medium">
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}
