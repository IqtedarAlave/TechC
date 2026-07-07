import { Metadata } from "next";
import { Shield, ExternalLink, Award, Lock } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = { title: "Badges" };

const EARNED_BADGES = [
  {
    uid: "tc_a3f9d2b1e7",
    projectTitle: "Portfolio Website",
    path: "Web Development",
    difficulty: "Junior",
    autoScore: 92,
    aiScore: 89,
    mentorNote: "Clean code structure. Good responsive design. README is thorough. Strong junior-level submission.",
    approvedAt: "June 1, 2024",
  },
];

const LOCKED_BADGES = [
  { title: "REST API", path: "Web Development", difficulty: "Junior", hint: "Submit your REST API project" },
  { title: "Full-Stack App", path: "Web Development", difficulty: "Mid", hint: "Complete Junior level first" },
  { title: "Real-Time App", path: "Web Development", difficulty: "Mid", hint: "Complete Junior level first" },
  { title: "Senior — Architecture", path: "Web Development", difficulty: "Senior", hint: "Complete Intermediate level first" },
];

export default function BadgesPage() {
  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <h1 className="text-2xl font-display font-bold text-white">My Badges</h1>
        <p className="text-[--text-muted] text-sm mt-1">
          Each badge is publicly verifiable. Employers can scan the UID to confirm authenticity.
        </p>
      </div>

      {/* Earned */}
      <div>
        <h2 className="section-title mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-accent-400" />
          Earned ({EARNED_BADGES.length})
        </h2>

        <div className="space-y-4">
          {EARNED_BADGES.map((b) => (
            <div key={b.uid} className="card border-accent-500/20 bg-accent-500/5">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-accent-500/20 border border-accent-500/30 flex items-center justify-center text-accent-400">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{b.projectTitle}</p>
                    <p className="text-xs text-[--text-muted]">{b.path} · {b.difficulty} level</p>
                    <p className="text-[10px] text-[--text-muted] mt-0.5">Issued {b.approvedAt}</p>
                  </div>
                </div>
                <span className="badge-green flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Verified
                </span>
              </div>

              {/* Scores */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="text-center p-3 rounded-xl bg-surface-card">
                  <p className="text-2xl font-bold font-display text-brand-300">{b.autoScore}</p>
                  <p className="text-[10px] text-[--text-muted] mt-0.5">Auto check</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-surface-card">
                  <p className="text-2xl font-bold font-display text-purple-300">{b.aiScore}</p>
                  <p className="text-[10px] text-[--text-muted] mt-0.5">AI review</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-accent-500/10">
                  <p className="text-accent-400 font-bold text-sm mt-1">Approved</p>
                  <p className="text-[10px] text-[--text-muted] mt-0.5">Mentor badge</p>
                </div>
              </div>

              {/* Mentor note */}
              <div className="bg-surface-card rounded-xl p-4 mb-4">
                <p className="text-[10px] text-[--text-muted] uppercase tracking-wider mb-2">Mentor note</p>
                <p className="text-sm text-[--text] leading-relaxed italic">"{b.mentorNote}"</p>
              </div>

              {/* Verify link */}
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-surface-card rounded-xl px-4 py-2.5 flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-accent-400 shrink-0" />
                  <span className="text-xs font-mono text-accent-300 truncate">techc.app/verify/{b.uid}</span>
                </div>
                <a href={`/verify/${b.uid}`} target="_blank"
                  className="btn-secondary text-xs flex items-center gap-1.5 shrink-0">
                  <ExternalLink className="w-3.5 h-3.5" /> Verify
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Locked */}
      <div>
        <h2 className="section-title mb-4 flex items-center gap-2">
          <Lock className="w-4 h-4 text-[--text-muted]" />
          <span className="text-[--text-muted]">Locked ({LOCKED_BADGES.length})</span>
        </h2>

        <div className="grid sm:grid-cols-2 gap-3">
          {LOCKED_BADGES.map((b) => (
            <div key={b.title} className="card opacity-60 border-dashed">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-surface-muted flex items-center justify-center text-[--text-muted]">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[--text-muted]">{b.title}</p>
                  <p className="text-xs text-[--text-muted]">{b.path} · {b.difficulty}</p>
                </div>
              </div>
              <p className="text-xs text-[--text-muted] pl-12">{b.hint}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <Link href="/projects" className="btn-primary inline-flex items-center gap-2">
            Submit a project to earn your next badge
          </Link>
        </div>
      </div>
    </div>
  );
}
