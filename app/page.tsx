"use client";
import Link from "next/link";
import { ArrowRight, GitBranch, Shield, Briefcase, CheckCircle, ChevronRight } from "lucide-react";

const CAREER_PATHS = [
  { label: "Web Dev", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  { label: "AI / ML", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
  { label: "Cybersecurity", color: "text-red-400 bg-red-500/10 border-red-500/20" },
  { label: "Embedded Systems", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
  { label: "Data Science", color: "text-green-400 bg-green-500/10 border-green-500/20" },
  { label: "UI / UX", color: "text-pink-400 bg-pink-500/10 border-pink-500/20" },
  { label: "DevOps", color: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Pick your path",
    desc: "Choose a career track — Web Dev, AI/ML, Cybersecurity, Embedded Systems. Get a roadmap built for BD job market realities.",
    icon: <ArrowRight className="w-5 h-5" />,
  },
  {
    step: "02",
    title: "Build real projects",
    desc: "Complete structured projects. Push to GitHub. No passive video watching — only things you actually ship.",
    icon: <GitBranch className="w-5 h-5" />,
  },
  {
    step: "03",
    title: "Get verified",
    desc: "Three-layer validation: automated checks, AI code review, then a human mentor badge. Employers trust it.",
    icon: <Shield className="w-5 h-5" />,
  },
  {
    step: "04",
    title: "Access opportunities",
    desc: "Internships and jobs matched to your verified skill level. Apply directly. No middlemen.",
    icon: <Briefcase className="w-5 h-5" />,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0f1117]">

      {/* ── Nav ── */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-surface-border bg-[#0f1117]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-display font-bold text-xl text-white">
            Tech<span className="text-gradient">C</span>
          </span>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-ghost text-sm">Sign in</Link>
            <Link href="/register" className="btn-primary text-sm">Get started</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">

          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 badge-blue mb-8 animate-fade-in">
            <span className="status-dot bg-accent-400 animate-pulse" />
            Built for CSE &amp; EEE students in Bangladesh
          </div>

          <h1 className="text-5xl sm:text-6xl font-display font-bold text-white leading-[1.1] mb-6 animate-fade-up">
            Your GitHub is the garage.{" "}
            <span className="text-gradient">TechC is the showroom.</span>
          </h1>

          <p className="text-lg text-[--text-muted] max-w-2xl mx-auto leading-relaxed mb-10 animate-fade-up animate-delay-100">
            Bridge the gap between what your university teaches and what BD tech companies actually hire for.
            Build projects. Get verified. Land your first real job.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-up animate-delay-200">
            <Link href="/register/student" className="btn-primary flex items-center justify-center gap-2 text-base px-7 py-3">
              Start as a student <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/register/employer" className="btn-secondary flex items-center justify-center gap-2 text-base px-7 py-3">
              Hire verified talent
            </Link>
          </div>

          {/* Career path chips */}
          <div className="flex flex-wrap justify-center gap-2 mt-12 animate-fade-up animate-delay-300">
            {CAREER_PATHS.map((p) => (
              <span key={p.label} className={`badge border ${p.color} px-3 py-1.5`}>
                {p.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 px-6 border-t border-surface-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-display font-bold text-white mb-3">How TechC works</h2>
            <p className="text-[--text-muted]">Four steps from student to hired</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((item, i) => (
              <div key={i} className="card-hover group relative">
                <span className="font-mono text-4xl font-bold text-surface-muted group-hover:text-brand-500/30 transition-colors duration-200 select-none">
                  {item.step}
                </span>
                <div className="mt-4 mb-3 text-brand-400">{item.icon}</div>
                <h3 className="font-display font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-[--text-muted] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Validation explained ── */}
      <section className="py-20 px-6 bg-surface-card/30">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="badge-green mb-4 inline-flex">Skill Validation</span>
              <h2 className="text-3xl font-display font-bold text-white mb-4 leading-tight">
                Three layers of proof — not just a certificate
              </h2>
              <p className="text-[--text-muted] leading-relaxed mb-8">
                Every project you submit goes through three verification stages before a badge is issued.
                Employers see exactly how you earned it.
              </p>
              <div className="space-y-4">
                {[
                  { label: "Automated check", desc: "GitHub repo structure, commits, README, code quality scan", color: "bg-brand-500" },
                  { label: "AI code review", desc: "Depth, originality, and correctness scored by AI", color: "bg-purple-500" },
                  { label: "Mentor badge", desc: "Human mentor reviews and signs off with a verifiable UID", color: "bg-accent-500" },
                ].map((v, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className={`w-2 mt-2 h-2 rounded-full ${v.color} shrink-0`} />
                    <div>
                      <span className="text-sm font-medium text-[--text]">{v.label}</span>
                      <p className="text-xs text-[--text-muted] mt-0.5">{v.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mock badge card */}
            <div className="card glow-brand">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center text-brand-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-white text-sm">Verified Badge</p>
                  <p className="text-xs text-[--text-muted]">Web Dev · Junior</p>
                </div>
                <span className="badge-green ml-auto">✓ Verified</span>
              </div>
              <div className="bg-surface-muted rounded-xl p-4 font-mono text-xs text-[--text-muted] break-all">
                techc.app/verify/<span className="text-brand-300">tc_a3f9d2b1e7</span>
              </div>
              <div className="divider" />
              <div className="space-y-2">
                {["Auto check: 91/100", "AI review: 87/100", "Mentor: Approved"].map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-accent-400 shrink-0" />
                    <span className="text-[--text-muted]">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-white mb-4">
            Ready to build something real?
          </h2>
          <p className="text-[--text-muted] mb-8">
            TechC is free for students. Start with one project. Get your first badge.
          </p>
          <Link href="/register/student" className="btn-primary inline-flex items-center gap-2 text-base px-8 py-3">
            Create your profile <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-surface-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-[--text-muted]">
          <span>TechC — Built in Bangladesh 🇧🇩</span>
          <div className="flex gap-6">
            <Link href="/login" className="hover:text-[--text] transition-colors">Sign in</Link>
            <Link href="/register" className="hover:text-[--text] transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
