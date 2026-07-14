import { Metadata } from "next";
import { Shield, GitBranch, ExternalLink, Github, Linkedin, Globe } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CAREER_PATH_LABELS } from "@/lib/utils";

function ensureAbsoluteUrl(url: string | null | undefined) {
  if (!url) return "";
  const trimUrl = url.trim();
  if (trimUrl === "") return "";
  if (/^https?:\/\//i.test(trimUrl)) return trimUrl;
  return `https://${trimUrl}`;
}

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  const profile = await prisma.studentProfile.findUnique({
    where: { username: params.username },
    include: { user: true },
  });

  if (!profile || !profile.isPublic) {
    return {
      title: "Profile Not Found",
    };
  }

  return {
    title: `${profile.user.name} — TechC Portfolio`,
    description: profile.bio || "",
  };
}

export default async function PublicPortfolioPage({ params }: { params: { username: string } }) {
  const profile = await prisma.studentProfile.findUnique({
    where: { username: params.username },
    include: {
      user: true,
      submissions: {
        where: {
          status: {
            in: ["PENDING", "AUTO_CHECKED", "AI_REVIEWED", "MENTOR_APPROVED"],
          },
        },
        include: {
          project: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!profile || !profile.isPublic) {
    notFound();
  }

  // Filter submissions for mentor approved badges
  const badges = profile.submissions
    .filter((sub) => sub.status === "MENTOR_APPROVED" && sub.badgeUid)
    .map((sub) => ({
      uid: sub.badgeUid!,
      projectTitle: sub.project.title,
      difficulty: sub.project.difficulty,
      path: CAREER_PATH_LABELS[profile.careerPath || ""] || profile.careerPath || "",
      autoScore: sub.autoCheckScore ?? 0,
      aiScore: sub.aiReviewScore ?? 0,
      approvedAt: sub.mentorApprovedAt ? new Date(sub.mentorApprovedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }) : "",
    }));

  const projects = profile.submissions.map((sub) => ({
    title: sub.project.title,
    githubUrl: sub.githubUrl,
    description: sub.description || sub.project.description,
    skills: sub.project.skills,
    status: sub.status,
  }));

  const s = {
    name: profile.user.name,
    username: profile.username,
    university: profile.university,
    department: profile.department,
    graduationYear: profile.graduationYear,
    careerPath: CAREER_PATH_LABELS[profile.careerPath || ""] || profile.careerPath || "No Track Selected",
    bio: profile.bio || "No bio added yet.",
    githubUrl: profile.githubUrl,
    linkedinUrl: profile.linkedinUrl,
    skills: profile.skills,
    badges: badges,
    projects: projects,
  };

  return (
    <div className="min-h-screen bg-[#0f1117]">
      {/* Top bar */}
      <nav className="border-b border-surface-border py-3 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span className="font-display font-bold text-white">
            Tech<span className="text-gradient">C</span>
          </span>
          <p className="text-xs text-[--text-muted]">Verified portfolio · techc.app/u/{params.username}</p>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">

        {/* Profile header */}
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-20 h-20 rounded-2xl bg-brand-500/20 border-2 border-brand-500/30 flex items-center justify-center text-3xl font-display font-bold text-brand-300 shrink-0">
            {s.name[0]}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-2xl font-display font-bold text-white">{s.name}</h1>
              {s.badges.length > 0 && (
                <span className="badge-green flex items-center gap-1">
                  <Shield className="w-3 h-3" /> TechC Verified
                </span>
              )}
            </div>
            <p className="text-[--text-muted] text-sm mb-3">
              {s.department} · {s.university} · Class of {s.graduationYear}
            </p>
            <p className="text-sm text-[--text] leading-relaxed max-w-xl mb-4">{s.bio}</p>
            <div className="flex flex-wrap gap-3">
              {s.githubUrl && (
                <a href={ensureAbsoluteUrl(s.githubUrl)} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-[--text-muted] hover:text-[--text] transition-colors">
                  <Github className="w-4 h-4" /> GitHub
                </a>
              )}
              {s.linkedinUrl && (
                <a href={ensureAbsoluteUrl(s.linkedinUrl)} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-[--text-muted] hover:text-[--text] transition-colors">
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Skills */}
        {s.skills && s.skills.length > 0 && (
          <div className="card">
            <h2 className="section-title mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {s.skills.map((sk) => <span key={sk} className="badge-blue">{sk}</span>)}
            </div>
          </div>
        )}

        {/* Verified badges */}
        {s.badges.length > 0 && (
          <div>
            <h2 className="section-title mb-4">Verified Badges</h2>
            <div className="space-y-4">
              {s.badges.map((b) => (
                <div key={b.uid} className="card border-accent-500/20 bg-accent-500/5">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent-500/20 flex items-center justify-center text-accent-400">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{b.projectTitle}</p>
                        <p className="text-xs text-[--text-muted]">{b.path} · {b.difficulty} level</p>
                      </div>
                    </div>
                    <span className="badge-green">✓ Mentor approved</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center p-3 rounded-xl bg-surface-muted">
                      <p className="text-lg font-bold text-brand-300">{b.autoScore}</p>
                      <p className="text-[10px] text-[--text-muted]">Auto check</p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-surface-muted">
                      <p className="text-lg font-bold text-purple-300">{b.aiScore}</p>
                      <p className="text-[10px] text-[--text-muted]">AI review</p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-accent-500/10">
                      <p className="text-accent-400 text-xs font-bold">Approved</p>
                      <p className="text-[10px] text-[--text-muted]">Mentor badge</p>
                    </div>
                  </div>

                  <div className="bg-surface-muted rounded-xl px-4 py-2.5 flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-accent-400 shrink-0" />
                    <span className="text-xs text-[--text-muted]">Verify at </span>
                    <span className="text-xs font-mono text-accent-300">techc.app/verify/{b.uid}</span>
                  </div>
                  <p className="text-xs text-[--text-muted] mt-2">Issued {b.approvedAt}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {s.projects && s.projects.length > 0 && (
          <div>
            <h2 className="section-title mb-4">Projects</h2>
            <div className="space-y-4">
              {s.projects.map((p) => (
                <div key={p.title} className="card-hover">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400">
                        <GitBranch className="w-4 h-4" />
                      </div>
                      <p className="font-semibold text-[--text]">{p.title}</p>
                    </div>
                    {p.status === "MENTOR_APPROVED" && <span className="badge-green text-[10px]">✓ Verified</span>}
                    {p.status === "AI_REVIEWED" && <span className="badge-yellow text-[10px]">AI reviewed</span>}
                    {p.status === "AUTO_CHECKED" && <span className="badge-blue text-[10px]">Auto checked</span>}
                    {p.status === "PENDING" && <span className="badge-muted text-[10px]">Pending review</span>}
                  </div>
                  <p className="text-sm text-[--text-muted] mb-3">{p.description}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    {p.skills.map((sk) => <span key={sk} className="badge-muted text-[10px]">{sk}</span>)}
                    <a href={ensureAbsoluteUrl(p.githubUrl)} target="_blank" rel="noopener noreferrer"
                      className="ml-auto flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300">
                      View on GitHub <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-surface-border pt-6 flex items-center justify-between">
          <p className="text-xs text-[--text-muted]">Verified by TechC · techc.app</p>
          <a href="/" className="text-xs text-brand-400 hover:text-brand-300">Build your profile →</a>
        </div>
      </div>
    </div>
  );
}
