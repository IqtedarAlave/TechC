"use client";

import { useState, useEffect } from "react";
import { Shield, ExternalLink, Award, Lock, Loader2 } from "lucide-react";
import Link from "next/link";
import { CAREER_PATH_LABELS } from "@/lib/utils";

interface Submission {
  id: string;
  badgeUid: string | null;
  status: string;
  autoCheckScore: number | null;
  aiReviewScore: number | null;
  mentorNotes: string | null;
  mentorApprovedAt: string | null;
  project: {
    id: string;
    title: string;
    difficulty: string;
    roadmap: {
      path: string;
      title: string;
    };
  };
}

interface RoadmapProject {
  id: string;
  title: string;
  difficulty: string;
}

export default function BadgesPage() {
  const [earnedBadges, setEarnedBadges] = useState<Submission[]>([]);
  const [lockedBadges, setLockedBadges] = useState<RoadmapProject[]>([]);
  const [careerPathLabel, setCareerPathLabel] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBadgesData() {
      try {
        const [subRes, rmRes] = await Promise.all([
          fetch("/api/submissions"),
          fetch("/api/roadmap"),
        ]);

        let submittedIds: string[] = [];

        if (subRes.ok) {
          const subData = await subRes.json();
          const subs: Submission[] = subData.submissions || [];
          const earned = subs.filter((s) => s.status === "MENTOR_APPROVED" && s.badgeUid);
          setEarnedBadges(earned);
          submittedIds = subs.map((s) => s.project.id);
        }

        if (rmRes.ok) {
          const rmData = await rmRes.json();
          if (rmData.roadmap) {
            const path = rmData.roadmap.path;
            setCareerPathLabel(CAREER_PATH_LABELS[path] || rmData.roadmap.title);
            
            const allProjects: RoadmapProject[] = rmData.roadmap.projects || [];
            // Locked badges are projects on the roadmap that have not been submitted at all
            const locked = allProjects.filter((p) => !submittedIds.includes(p.id));
            setLockedBadges(locked);
          }
        }
      } catch (err) {
        console.error("Error loading badges data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadBadgesData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-[--text-muted]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        <p className="text-sm">Loading badges...</p>
      </div>
    );
  }

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
          Earned ({earnedBadges.length})
        </h2>

        {earnedBadges.length === 0 ? (
          <div className="card text-center py-12 text-[--text-muted]">
            <p className="text-sm">You haven&apos;t earned any badges yet.</p>
            <p className="text-xs mt-1">Submit your projects and wait for mentor evaluation.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {earnedBadges.map((b) => {
              const formattedDate = b.mentorApprovedAt 
                ? new Date(b.mentorApprovedAt).toLocaleDateString("en-BD", { day: "numeric", month: "short", year: "numeric" })
                : "Recently";
              return (
                <div key={b.badgeUid} className="card border-accent-500/20 bg-accent-500/5 animate-fade-in">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-accent-500/20 border border-accent-500/30 flex items-center justify-center text-accent-400">
                        <Shield className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{b.project.title}</p>
                        <p className="text-xs text-[--text-muted]">
                          {CAREER_PATH_LABELS[b.project.roadmap.path] || b.project.roadmap.title} · <span className="uppercase">{b.project.difficulty}</span> level
                        </p>
                        <p className="text-[10px] text-[--text-muted] mt-0.5">Issued {formattedDate}</p>
                      </div>
                    </div>
                    <span className="badge-green flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Verified
                    </span>
                  </div>

                  {/* Scores */}
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="text-center p-3 rounded-xl bg-surface-card border border-surface-border">
                      <p className="text-2xl font-bold font-display text-brand-300">{b.autoCheckScore ?? "—"}</p>
                      <p className="text-[10px] text-[--text-muted] mt-0.5">Auto check</p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-surface-card border border-surface-border">
                      <p className="text-2xl font-bold font-display text-purple-300">{b.aiReviewScore ?? "—"}</p>
                      <p className="text-[10px] text-[--text-muted] mt-0.5">AI review</p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-accent-500/10">
                      <p className="text-accent-400 font-bold text-sm mt-1">Approved</p>
                      <p className="text-[10px] text-[--text-muted] mt-0.5">Mentor badge</p>
                    </div>
                  </div>

                  {/* Mentor note */}
                  {b.mentorNotes && (
                    <div className="bg-surface-card rounded-xl border border-surface-border p-4 mb-4">
                      <p className="text-[10px] text-[--text-muted] uppercase tracking-wider mb-2">Mentor note</p>
                      <p className="text-sm text-[--text] leading-relaxed italic">&quot;{b.mentorNotes}&quot;</p>
                    </div>
                  )}

                  {/* Verify link */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-surface-card border border-surface-border rounded-xl px-4 py-2.5 flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-accent-400 shrink-0" />
                      <span className="text-xs font-mono text-accent-300 truncate">techc.app/verify/{b.badgeUid}</span>
                    </div>
                    <a href={`/verify/${b.badgeUid}`} target="_blank" rel="noopener noreferrer"
                      className="btn-secondary text-xs flex items-center gap-1.5 shrink-0">
                      <ExternalLink className="w-3.5 h-3.5" /> Verify
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Locked */}
      <div>
        <h2 className="section-title mb-4 flex items-center gap-2">
          <Lock className="w-4 h-4 text-[--text-muted]" />
          <span className="text-[--text-muted]">Locked ({lockedBadges.length})</span>
        </h2>

        {lockedBadges.length === 0 ? (
          <div className="card text-center py-6 text-[--text-muted] border-dashed">
            <p className="text-sm">You have unlocked all badges on this roadmap!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {lockedBadges.map((b) => (
              <div key={b.id} className="card opacity-60 border-dashed animate-fade-in">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-surface-muted flex items-center justify-center text-[--text-muted]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[--text-muted]">{b.title}</p>
                    <p className="text-xs text-[--text-muted]">{careerPathLabel} · <span className="uppercase">{b.difficulty}</span></p>
                  </div>
                </div>
                <p className="text-xs text-[--text-muted] pl-12">Submit your {b.title} project to unlock</p>
              </div>
            ))}
          </div>
        )}

        {lockedBadges.length > 0 && (
          <div className="mt-6 text-center">
            <Link href="/projects" className="btn-primary inline-flex items-center gap-2">
              Submit a project to earn your next badge
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
