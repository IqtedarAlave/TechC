import { Metadata } from "next";
import { MapPin, Clock, DollarSign, Building2, Shield, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = { title: "Jobs" };

const JOBS = [
  {
    id: "1", title: "Junior Frontend Developer", company: "Shajgoj Tech", location: "Dhaka",
    type: "Full-time", path: "Web Dev", salary: "20,000–30,000 BDT", deadline: "Jun 30",
    verified: true, requirements: ["React", "Tailwind", "REST API"], requiresBadge: true,
    description: "Join our product team building Bangladesh's largest beauty e-commerce platform.",
  },
  {
    id: "2", title: "React Intern", company: "Acme Technologies", location: "Remote",
    type: "Internship", path: "Web Dev", salary: "12,000–15,000 BDT", deadline: "Jul 5",
    verified: true, requirements: ["React", "JavaScript", "Git"], requiresBadge: false,
    description: "3-month internship with real product work. Possibility of full-time offer.",
  },
  {
    id: "3", title: "ML Engineer Intern", company: "Maya Technologies", location: "Dhaka",
    type: "Internship", path: "AI/ML", salary: "15,000 BDT", deadline: "Jul 10",
    verified: true, requirements: ["Python", "TensorFlow", "Pandas"], requiresBadge: true,
    description: "Work on our health AI models. You'll ship real code to production.",
  },
  {
    id: "4", title: "Node.js Backend Intern", company: "10 Minute School", location: "Hybrid",
    type: "Internship", path: "Web Dev", salary: "12,000 BDT", deadline: "Jul 15",
    verified: false, requirements: ["Node.js", "PostgreSQL", "REST"], requiresBadge: false,
    description: "Build APIs for Bangladesh's largest ed-tech platform.",
  },
];

const TYPE_BADGE: Record<string, string> = {
  "Full-time": "badge-blue",
  "Internship": "badge-yellow",
  "Part-time": "badge-muted",
  "Contract": "badge-muted",
};

// Student's current badge status (mock)
const STUDENT_HAS_BADGE = true;

export default function JobsPage() {
  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Job Board</h1>
        <p className="text-[--text-muted] text-sm mt-1">
          Listings matched to your career path. Verified companies only.
        </p>
      </div>

      {/* Badge banner */}
      {!STUDENT_HAS_BADGE && (
        <div className="card border-yellow-500/20 bg-yellow-500/5">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-yellow-400 shrink-0" />
            <div>
              <p className="text-sm font-medium text-yellow-300">Some listings require a TechC badge to apply</p>
              <p className="text-xs text-[--text-muted] mt-0.5">
                Complete your first roadmap project and get mentor approval to unlock direct applications.{" "}
                <Link href="/projects" className="text-yellow-400 hover:text-yellow-300">Submit a project →</Link>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filter strip */}
      <div className="flex gap-2 flex-wrap">
        {["All", "Web Dev", "AI/ML", "Cybersecurity", "DevOps", "Internship", "Full-time", "Remote"].map((f) => (
          <button key={f} className={`btn-ghost text-xs px-3 py-1.5 ${f === "All" ? "bg-surface-muted text-[--text]" : ""}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Job listings */}
      <div className="space-y-4">
        {JOBS.map((job) => {
          const canApply = !job.requiresBadge || STUDENT_HAS_BADGE;
          return (
            <div key={job.id} className="card-hover group">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-300 font-bold text-lg shrink-0">
                    {job.company[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <h2 className="font-semibold text-[--text]">{job.title}</h2>
                      {job.verified && (
                        <span className="badge-green text-[10px] flex items-center gap-0.5">
                          <Shield className="w-2.5 h-2.5" /> Verified employer
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[--text-muted]">{job.company}</p>
                  </div>
                </div>
                <span className={`${TYPE_BADGE[job.type]} shrink-0`}>{job.type}</span>
              </div>

              <p className="text-sm text-[--text-muted] leading-relaxed mb-4">{job.description}</p>

              <div className="flex flex-wrap gap-4 text-xs text-[--text-muted] mb-4">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {job.salary}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Deadline: {job.deadline}</span>
                <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {job.path}</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {job.requirements.map((r) => <span key={r} className="badge-muted text-[10px]">{r}</span>)}
                {job.requiresBadge && (
                  <span className="badge-green text-[10px] flex items-center gap-1">
                    <Shield className="w-2.5 h-2.5" /> Badge required
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {canApply ? (
                  <button className="btn-primary text-sm flex items-center gap-1.5">
                    Apply now <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button disabled className="btn-secondary text-sm flex items-center gap-1.5 opacity-60 cursor-not-allowed">
                    <Lock className="w-3.5 h-3.5" /> Earn a badge to apply
                  </button>
                )}
                <button className="btn-ghost text-sm">Save job</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
