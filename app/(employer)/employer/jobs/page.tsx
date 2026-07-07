"use client";
import { useState } from "react";
import Link from "next/link";
import { MapPin, Clock, Users, Edit3, ToggleLeft, ToggleRight, Trash2, PlusCircle } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";

type Job = {
  id: string; title: string; type: string; path: string;
  location: string; salary: string; applications: number;
  isActive: boolean; postedAt: string; deadline: string;
};

const INITIAL_JOBS: Job[] = [
  {
    id: "1", title: "Junior Frontend Developer", type: "Full-time", path: "Web Dev",
    location: "Dhaka", salary: "20,000–30,000 BDT", applications: 12,
    isActive: true, postedAt: "Jun 5", deadline: "Jun 30",
  },
  {
    id: "2", title: "React Intern", type: "Internship", path: "Web Dev",
    location: "Remote", salary: "12,000–15,000 BDT", applications: 11,
    isActive: true, postedAt: "Jun 8", deadline: "Jul 5",
  },
  {
    id: "3", title: "Node.js Backend Intern", type: "Internship", path: "Web Dev",
    location: "Dhaka", salary: "12,000 BDT", applications: 5,
    isActive: false, postedAt: "May 20", deadline: "Jun 10",
  },
];

const TYPE_BADGE: Record<string, string> = {
  "Full-time": "badge-blue", "Internship": "badge-yellow", "Part-time": "badge-muted",
};

export default function EmployerJobsPage() {
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  function toggleActive(id: string) {
    setJobs((prev) => prev.map((j) => j.id === id ? { ...j, isActive: !j.isActive } : j));
    const job = jobs.find((j) => j.id === id);
    toast("success", job?.isActive ? "Listing paused" : "Listing reactivated");
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setJobs((prev) => prev.filter((j) => j.id !== deleteTarget));
    setDeleteTarget(null);
    setDeleting(false);
    toast("success", "Listing deleted");
  }

  const active = jobs.filter((j) => j.isActive);
  const inactive = jobs.filter((j) => !j.isActive);
  const totalApplications = jobs.reduce((sum, j) => sum + j.applications, 0);

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">My Job Listings</h1>
          <p className="text-[--text-muted] text-sm mt-1">
            {active.length} active · {totalApplications} total applications
          </p>
        </div>
        <Link href="/employer/post-job" className="btn-primary flex items-center gap-2 text-sm">
          <PlusCircle className="w-4 h-4" /> Post new job
        </Link>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Active listings", value: active.length, color: "text-accent-400" },
          { label: "Total applications", value: totalApplications, color: "text-brand-400" },
          { label: "Closed listings", value: inactive.length, color: "text-[--text-muted]" },
        ].map(({ label, value, color }) => (
          <div key={label} className="card text-center py-4">
            <p className={`text-2xl font-bold font-display ${color}`}>{value}</p>
            <p className="text-xs text-[--text-muted] mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Active listings */}
      {active.length > 0 && (
        <div>
          <h2 className="section-title mb-4">Active listings</h2>
          <div className="space-y-3">
            {active.map((job) => (
              <JobCard key={job.id} job={job}
                onToggle={() => toggleActive(job.id)}
                onDelete={() => setDeleteTarget(job.id)} />
            ))}
          </div>
        </div>
      )}

      {/* Closed listings */}
      {inactive.length > 0 && (
        <div>
          <h2 className="section-title mb-4 text-[--text-muted]">Closed / Paused</h2>
          <div className="space-y-3 opacity-70">
            {inactive.map((job) => (
              <JobCard key={job.id} job={job}
                onToggle={() => toggleActive(job.id)}
                onDelete={() => setDeleteTarget(job.id)} />
            ))}
          </div>
        </div>
      )}

      {jobs.length === 0 && (
        <div className="card text-center py-14">
          <p className="text-[--text-muted] text-sm mb-4">No listings yet. Post your first job to start receiving applications.</p>
          <Link href="/employer/post-job" className="btn-primary inline-flex items-center gap-2">
            <PlusCircle className="w-4 h-4" /> Post a job
          </Link>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this listing?"
        message="This will permanently remove the listing and all associated applications. This cannot be undone."
        confirmLabel="Delete listing"
        danger loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

function JobCard({ job, onToggle, onDelete }: {
  job: Job; onToggle: () => void; onDelete: () => void;
}) {
  const TYPE_BADGE: Record<string, string> = {
    "Full-time": "badge-blue", "Internship": "badge-yellow", "Part-time": "badge-muted",
  };

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-semibold text-[--text]">{job.title}</h3>
            <span className={TYPE_BADGE[job.type] || "badge-muted"}>{job.type}</span>
            <span className={job.isActive ? "badge-green text-[10px]" : "badge-muted text-[10px]"}>
              {job.isActive ? "● Active" : "○ Paused"}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-[--text-muted]">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
            <span>{job.salary}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Deadline: {job.deadline}</span>
            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{job.applications} applicants</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={onToggle} title={job.isActive ? "Pause listing" : "Reactivate"}
            className="w-8 h-8 rounded-lg bg-surface-muted flex items-center justify-center text-[--text-muted] hover:text-[--text] transition-colors">
            {job.isActive
              ? <ToggleRight className="w-4 h-4 text-accent-400" />
              : <ToggleLeft className="w-4 h-4" />}
          </button>
          <button onClick={onDelete}
            className="w-8 h-8 rounded-lg bg-surface-muted flex items-center justify-center text-[--text-muted] hover:text-red-400 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-surface-border">
        <Link href={`/employer/jobs/${job.id}/applications`}
          className="btn-secondary text-xs flex items-center gap-1.5">
          <Users className="w-3 h-3" /> View applications ({job.applications})
        </Link>
        <Link href={`/employer/jobs/${job.id}/edit`}
          className="btn-ghost text-xs flex items-center gap-1.5">
          <Edit3 className="w-3 h-3" /> Edit
        </Link>
        <p className="text-[10px] text-[--text-muted] ml-auto">Posted {job.postedAt}</p>
      </div>
    </div>
  );
}
