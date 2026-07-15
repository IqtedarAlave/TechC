"use client";

import { useState, useEffect } from "react";
import {
  GitBranch, Award, Briefcase, TrendingUp,
  Clock, CheckCircle, AlertCircle, ArrowRight, Loader2
} from "lucide-react";
import Link from "next/link";
import { CAREER_PATH_LABELS } from "@/lib/utils";

interface Submission {
  id: string;
  status: string;
  autoCheckScore: number | null;
  aiReviewScore: number | null;
  project: {
    id: string;
    title: string;
    difficulty: string;
  };
}

interface UserProfile {
  name: string;
  studentProfile: {
    careerPath: string | null;
    bio: string | null;
    githubUrl: string | null;
    linkedinUrl: string | null;
    portfolioUrl: string | null;
    skills: string[];
    applications: any[];
  } | null;
}

interface RoadmapProject {
  id: string;
  title: string;
  difficulty: string;
  skills: string[];
}

const STATUS_MAP: Record<string, { label: string; class: string; icon: React.ReactNode }> = {
  PENDING:         { label: "Pending review", class: "badge-muted", icon: <Clock className="w-3 h-3" /> },
  AUTO_CHECKED:    { label: "Auto checked",   class: "badge-blue",  icon: <CheckCircle className="w-3 h-3" /> },
  AI_REVIEWED:     { label: "AI reviewed",    class: "badge-yellow", icon: <CheckCircle className="w-3 h-3" /> },
  MENTOR_APPROVED: { label: "Mentor approved", class: "badge-green", icon: <CheckCircle className="w-3 h-3" /> },
  REJECTED:        { label: "Rejected",        class: "badge-red",   icon: <AlertCircle className="w-3 h-3" /> },
};

export default function StudentDashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [nextProjects, setNextProjects] = useState<RoadmapProject[]>([]);
  const [matchingJobsCount, setMatchingJobsCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [profRes, subRes] = await Promise.all([
          fetch("/api/profile"),
          fetch("/api/submissions"),
        ]);

        let path = "";
        let submittedIds: string[] = [];

        let approvedIds: string[] = [];

        if (profRes.ok) {
          const profData = await profRes.json();
          setProfile(profData.user);
          path = profData.user?.studentProfile?.careerPath || "";
        }

        if (subRes.ok) {
          const subData = await subRes.json();
          const subs: Submission[] = subData.submissions || [];
          setSubmissions(subs);
          approvedIds = subs.filter((s) => s.status === "MENTOR_APPROVED").map((s) => s.project.id);
        }

        // Fetch roadmap to get next projects
        if (path) {
          const rmRes = await fetch("/api/roadmap");
          if (rmRes.ok) {
            const rmData = await rmRes.json();
            const allProjects: RoadmapProject[] = rmData.roadmap?.projects || [];
            // Next projects are those which haven't been approved yet
            const uncompleted = allProjects.filter((p) => !approvedIds.includes(p.id));
            setNextProjects(uncompleted.slice(0, 2));
          }

          // Fetch jobs count matching the student's career path
          const jobsRes = await fetch(`/api/jobs?path=${path}`);
          if (jobsRes.ok) {
            const jobsData = await jobsRes.json();
            setMatchingJobsCount((jobsData.jobs || []).length);
          }
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-[--text-muted]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        <p className="text-sm">Loading dashboard...</p>
      </div>
    );
  }

  const name = profile?.name || "Student";
  const studentProfile = profile?.studentProfile;
  const careerPath = studentProfile?.careerPath || "";
  const careerPathLabel = careerPath ? (CAREER_PATH_LABELS[careerPath] || careerPath) : "No Track Selected";

  // Calculate profile strength (max 100)
  let strength = 20; // Base profile creation
  if (studentProfile?.bio) strength += 20;
  if (studentProfile?.githubUrl) strength += 20;
  if (studentProfile?.linkedinUrl) strength += 20;
  if (studentProfile?.skills && studentProfile.skills.length > 0) strength += 20;

  const totalSubmitted = submissions.length;
  const badgesEarned = submissions.filter((s) => s.status === "MENTOR_APPROVED").length;
  const jobsApplied = studentProfile?.applications?.length || 0;

  const stats = [
    { label: "Projects submitted", value: totalSubmitted.toString(), icon: GitBranch, color: "text-brand-400", bg: "bg-brand-500/10" },
    { label: "Badges earned", value: badgesEarned.toString(), icon: Award, color: "text-accent-400", bg: "bg-accent-500/10" },
    { label: "Jobs applied", value: jobsApplied.toString(), icon: Briefcase, color: "text-purple-400", bg: "bg-purple-500/10" },
    { label: "Profile strength", value: `${strength}%`, icon: TrendingUp, color: "text-yellow-400", bg: "bg-yellow-500/10" },
  ];

  const recentSubmissions = submissions.slice(0, 3);

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Good morning, {name} 👋</h1>
        <p className="text-[--text-muted] text-sm mt-1">
          You&apos;re on the <span className="text-brand-400 font-medium">{careerPathLabel}</span> track. Keep building.
        </p>
      </div>

      {/* Profile completeness banner */}
      {strength < 100 && (
        <div className="card border-yellow-500/20 bg-yellow-500/5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-300 mb-1">Complete your profile — {strength}% done</p>
              <div className="progress-bar">
                <div className="progress-fill bg-yellow-400" style={{ width: `${strength}%` }} />
              </div>
            </div>
            <Link href="/profile" className="btn-secondary text-sm shrink-0">
              Complete profile
            </Link>
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="stat-card">
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center ${color} mb-3`}>
              <Icon className="w-4.5 h-4.5" />
            </div>
            <span className="stat-value">{value}</span>
            <span className="stat-label">{label}</span>
          </div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Recent submissions */}
        <div className="lg:col-span-3 card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="section-title">Recent submissions</h2>
              <p className="section-subtitle">Your latest project validations</p>
            </div>
            <Link href="/projects" className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentSubmissions.length === 0 ? (
              <div className="text-center py-8 text-[--text-muted]">
                <p className="text-sm">No recent submissions found.</p>
                <Link href="/projects" className="btn-secondary text-xs mt-3 inline-block">Submit a project</Link>
              </div>
            ) : (
              recentSubmissions.map((sub) => {
                const s = STATUS_MAP[sub.status] || {
                  label: sub.status,
                  class: "badge-muted",
                  icon: <Clock className="w-3.5 h-3.5" />,
                };
                const score = sub.aiReviewScore ?? sub.autoCheckScore;
                return (
                  <div key={sub.id} className="flex items-center gap-4 p-3 rounded-xl bg-surface-muted/50 hover:bg-surface-muted transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400">
                      <GitBranch className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[--text] truncate">{sub.project.title}</p>
                      <p className="text-xs text-[--text-muted]">{careerPathLabel}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`${s.class} flex items-center gap-1`}>
                        {s.icon} {s.label}
                      </span>
                      {score !== null && (
                        <span className="text-xs text-[--text-muted]">{score}/100</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Next up */}
        <div className="lg:col-span-2 card">
          <div className="mb-5">
            <h2 className="section-title">Next on your roadmap</h2>
            <p className="section-subtitle">Suggested projects to tackle</p>
          </div>

          <div className="space-y-4">
            {nextProjects.length === 0 ? (
              <div className="text-center py-8 text-[--text-muted]">
                <CheckCircle className="w-8 h-8 text-accent-400 mx-auto mb-2" />
                <p className="text-sm">Congratulations! You finished all projects on this roadmap!</p>
              </div>
            ) : (
              nextProjects.map((p) => (
                <div key={p.id} className="p-4 rounded-xl border border-surface-border hover:border-brand-500/30 transition-colors group">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm font-medium text-[--text] group-hover:text-white transition-colors">{p.title}</p>
                    <span className="badge-blue text-[10px] shrink-0 uppercase">{p.difficulty}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {p.skills.map((s) => (
                      <span key={s} className="badge-muted text-[10px]">{s}</span>
                    ))}
                  </div>
                </div>
              ))
            )}

            <Link href="/roadmap" className="btn-secondary w-full flex items-center justify-center gap-2 text-sm mt-2">
              View full roadmap <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Jobs section teaser */}
      <div className="card border-accent-500/20 bg-accent-500/5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-accent-400 mb-1">
              {matchingJobsCount === 1 ? "1 job matches" : `${matchingJobsCount} jobs match`} your profile
            </p>
            <p className="text-sm text-[--text-muted]">
              {badgesEarned > 0 
                ? "Apply directly now with your verified profile." 
                : "Earn your mentor badge to unlock direct applications."}
            </p>
          </div>
          <Link href="/jobs" className="btn-secondary text-sm shrink-0 border-accent-500/20 hover:border-accent-500/40">
            View jobs
          </Link>
        </div>
      </div>
    </div>
  );
}
