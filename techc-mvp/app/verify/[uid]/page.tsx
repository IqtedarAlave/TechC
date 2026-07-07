import { Metadata } from "next";
import { Shield, CheckCircle, XCircle, ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";

async function getBadge(uid: string) {
  try {
    // In production this will hit the real API via absolute URL
    // For SSR in Next.js we query Prisma directly here
    const { prisma } = await import("@/lib/prisma");
    const submission = await prisma.projectSubmission.findUnique({
      where: { badgeUid: uid },
      include: {
        student: { include: { user: { select: { name: true } } } },
        project: { include: { roadmap: { select: { title: true } } } },
      },
    });
    if (!submission || submission.status !== "MENTOR_APPROVED") return null;
    return submission;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { uid: string } }): Promise<Metadata> {
  return {
    title: `Badge Verification · ${params.uid}`,
    description: "Verify a TechC skill badge",
  };
}

export default async function VerifyPage({ params }: { params: { uid: string } }) {
  const badge = await getBadge(params.uid);

  return (
    <div className="min-h-screen bg-[#0f1117] flex flex-col">
      {/* Nav */}
      <nav className="h-16 border-b border-surface-border flex items-center px-6">
        <Link href="/" className="font-display font-bold text-xl text-white">
          Tech<span className="text-gradient">C</span>
        </Link>
        <span className="ml-3 text-xs text-[--text-muted]">/ Badge Verification</span>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {badge ? (
            /* ── Valid badge ── */
            <div className="space-y-4 animate-fade-up">
              {/* Status banner */}
              <div className="card border-accent-500/30 bg-accent-500/5 text-center py-6">
                <div className="w-16 h-16 rounded-2xl bg-accent-500/20 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-accent-400" />
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-accent-400" />
                  <h1 className="text-xl font-display font-bold text-white">Badge Verified</h1>
                </div>
                <p className="text-sm text-[--text-muted]">
                  This is a legitimate TechC skill badge
                </p>
              </div>

              {/* Badge detail */}
              <div className="card space-y-4">
                <div>
                  <p className="text-xs text-[--text-muted] uppercase tracking-wider mb-1">Student</p>
                  <p className="font-semibold text-white">{badge.student.user.name}</p>
                  <a href={`/u/${badge.student.username}`} target="_blank"
                    className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 mt-0.5">
                    techc.app/u/{badge.student.username}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="divider" />

                <div>
                  <p className="text-xs text-[--text-muted] uppercase tracking-wider mb-1">Project</p>
                  <p className="font-semibold text-white">{badge.project.title}</p>
                  <p className="text-xs text-[--text-muted] mt-0.5">
                    {badge.project.roadmap.title} · {badge.project.difficulty} level
                  </p>
                </div>

                <div className="divider" />

                {/* Scores */}
                <div>
                  <p className="text-xs text-[--text-muted] uppercase tracking-wider mb-3">Validation scores</p>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-3 rounded-xl bg-brand-500/10">
                      <p className="text-xl font-bold font-display text-brand-300">
                        {badge.autoCheckScore ?? "—"}
                      </p>
                      <p className="text-[10px] text-[--text-muted] mt-0.5">Auto check</p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-purple-500/10">
                      <p className="text-xl font-bold font-display text-purple-300">
                        {badge.aiReviewScore ?? "—"}
                      </p>
                      <p className="text-[10px] text-[--text-muted] mt-0.5">AI review</p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-accent-500/10">
                      <p className="text-accent-400 font-bold mt-1">✓</p>
                      <p className="text-[10px] text-[--text-muted] mt-0.5">Mentor</p>
                    </div>
                  </div>
                </div>

                {badge.mentorNotes && (
                  <>
                    <div className="divider" />
                    <div>
                      <p className="text-xs text-[--text-muted] uppercase tracking-wider mb-2">Mentor note</p>
                      <p className="text-sm text-[--text] leading-relaxed italic">
                        "{badge.mentorNotes}"
                      </p>
                    </div>
                  </>
                )}

                <div className="divider" />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[--text-muted] uppercase tracking-wider mb-1">Badge UID</p>
                    <p className="text-xs font-mono text-accent-300">{params.uid}</p>
                  </div>
                  {badge.mentorApprovedAt && (
                    <div className="text-right">
                      <p className="text-xs text-[--text-muted] uppercase tracking-wider mb-1">Issued</p>
                      <p className="text-xs text-[--text]">
                        {new Date(badge.mentorApprovedAt).toLocaleDateString("en-BD", {
                          day: "numeric", month: "long", year: "numeric",
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-center text-xs text-[--text-muted]">
                Verified by TechC · techc.app
              </p>
            </div>
          ) : (
            /* ── Invalid badge ── */
            <div className="card text-center py-10 animate-fade-up">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
              <h1 className="text-xl font-display font-bold text-white mb-2">Badge Not Found</h1>
              <p className="text-sm text-[--text-muted] mb-2">
                No verified badge exists for UID:
              </p>
              <p className="text-xs font-mono text-red-400 mb-6">{params.uid}</p>
              <p className="text-xs text-[--text-muted] mb-6">
                This could mean the badge was revoked, the UID is incorrect, or the submission is still pending review.
              </p>
              <Link href="/" className="btn-secondary inline-flex items-center gap-2 text-sm">
                <ArrowLeft className="w-4 h-4" /> Go to TechC
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
