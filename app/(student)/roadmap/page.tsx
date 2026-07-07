"use client";
import { useState } from "react";
import { CheckCircle, Lock, Circle, ChevronRight, GitBranch, Award } from "lucide-react";

const ROADMAP = {
  path: "Web Development",
  totalProjects: 8,
  completedProjects: 1,
  levels: [
    {
      level: "Foundation",
      badge: "Junior-ready",
      color: "brand",
      projects: [
        {
          id: "1", title: "Portfolio Website", difficulty: "Junior",
          skills: ["HTML", "CSS", "JavaScript", "Responsive Design"],
          desc: "Build a personal portfolio with About, Projects, and Contact sections. Deploy on Vercel.",
          status: "MENTOR_APPROVED", githubTemplate: "https://github.com/techc/template-portfolio",
        },
        {
          id: "2", title: "REST API with Node.js & Express", difficulty: "Junior",
          skills: ["Node.js", "Express", "REST", "Postman"],
          desc: "Build a full CRUD API with proper error handling, status codes, and Postman docs.",
          status: "AI_REVIEWED", githubTemplate: null,
        },
        {
          id: "3", title: "React Todo App with State Management", difficulty: "Junior",
          skills: ["React", "useState", "useEffect", "Tailwind"],
          desc: "Build a task manager with local storage persistence and filter/sort capabilities.",
          status: "PENDING", githubTemplate: null,
        },
      ],
    },
    {
      level: "Intermediate",
      badge: "Mid-level ready",
      color: "purple",
      projects: [
        {
          id: "4", title: "Full-Stack CRUD App with Auth", difficulty: "Mid",
          skills: ["Next.js", "PostgreSQL", "Prisma", "JWT"],
          desc: "Build a full-stack app with user authentication, protected routes, and a real database.",
          status: "LOCKED", githubTemplate: null,
        },
        {
          id: "5", title: "Real-Time Chat with WebSockets", difficulty: "Mid",
          skills: ["Socket.io", "Node.js", "React", "Redis"],
          desc: "Implement a multi-room chat system with typing indicators and message history.",
          status: "LOCKED", githubTemplate: null,
        },
      ],
    },
    {
      level: "Advanced",
      badge: "Senior-ready",
      color: "accent",
      projects: [
        {
          id: "6", title: "Microservices Architecture", difficulty: "Senior",
          skills: ["Docker", "Node.js", "RabbitMQ", "API Gateway"],
          desc: "Break a monolith into microservices. Implement inter-service communication.",
          status: "LOCKED", githubTemplate: null,
        },
        {
          id: "7", title: "CI/CD Pipeline + Cloud Deployment", difficulty: "Senior",
          skills: ["GitHub Actions", "Docker", "Vercel", "Railway"],
          desc: "Set up a full CI/CD pipeline with automated testing and deployment.",
          status: "LOCKED", githubTemplate: null,
        },
      ],
    },
  ],
};

const STATUS_CONFIG: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  MENTOR_APPROVED: { icon: <CheckCircle className="w-4 h-4" />, label: "Verified", color: "text-accent-400" },
  AI_REVIEWED:     { icon: <CheckCircle className="w-4 h-4" />, label: "In review", color: "text-yellow-400" },
  PENDING:         { icon: <Circle className="w-4 h-4" />, label: "Submitted", color: "text-brand-400" },
  LOCKED:          { icon: <Lock className="w-4 h-4" />, label: "Locked", color: "text-[--text-muted]" },
  NOT_STARTED:     { icon: <Circle className="w-4 h-4" />, label: "Start", color: "text-[--text-muted]" },
};

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  brand:  { bg: "bg-brand-500/10", border: "border-brand-500/30", text: "text-brand-300", badge: "badge-blue" },
  purple: { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-300", badge: "badge-muted" },
  accent: { bg: "bg-accent-500/10", border: "border-accent-500/30", text: "text-accent-300", badge: "badge-green" },
};

export default function RoadmapPage() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const progress = Math.round((ROADMAP.completedProjects / ROADMAP.totalProjects) * 100);

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-display font-bold text-white">{ROADMAP.path}</h1>
          <span className="badge-blue">Your track</span>
        </div>
        <p className="text-[--text-muted] text-sm">
          {ROADMAP.completedProjects} of {ROADMAP.totalProjects} projects complete
        </p>
      </div>

      {/* Progress */}
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-[--text-muted]">Overall progress</span>
          <span className="text-sm font-medium text-brand-300">{progress}%</span>
        </div>
        <div className="progress-bar h-2.5">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex gap-6 mt-4">
          {[
            { label: "Verified", count: 1, color: "text-accent-400" },
            { label: "In review", count: 1, color: "text-yellow-400" },
            { label: "Locked", count: 5, color: "text-[--text-muted]" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className={`text-lg font-bold font-display ${s.color}`}>{s.count}</p>
              <p className="text-xs text-[--text-muted]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Levels */}
      {ROADMAP.levels.map((level) => {
        const c = COLOR_MAP[level.color];
        return (
          <div key={level.level}>
            {/* Level header */}
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${c.bg} ${c.border} mb-4`}>
              <Award className={`w-4 h-4 ${c.text}`} />
              <div className="flex-1">
                <span className={`font-semibold text-sm ${c.text}`}>{level.level}</span>
                <span className="text-xs text-[--text-muted] ml-2">— {level.badge}</span>
              </div>
              <span className={`${c.badge} text-[10px]`}>
                {level.projects.filter(p => p.status === "MENTOR_APPROVED").length}/{level.projects.length} done
              </span>
            </div>

            <div className="space-y-3 ml-4 border-l-2 border-surface-border pl-4">
              {level.projects.map((project) => {
                const s = STATUS_CONFIG[project.status];
                const isLocked = project.status === "LOCKED";
                const isSelected = selectedProject === project.id;

                return (
                  <div key={project.id}
                    className={`card transition-all duration-200 cursor-pointer
                      ${isLocked ? "opacity-60" : "hover:border-brand-500/20"}
                      ${isSelected ? "border-brand-500/30" : ""}`}
                    onClick={() => !isLocked && setSelectedProject(isSelected ? null : project.id)}>

                    <div className="flex items-center gap-3">
                      <span className={s.color}>{s.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-[--text]">{project.title}</p>
                          <span className="badge-muted text-[10px]">{project.difficulty}</span>
                          {project.status === "MENTOR_APPROVED" && <span className="badge-green text-[10px]">✓ Verified</span>}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {project.skills.map((sk) => (
                            <span key={sk} className="text-[10px] px-1.5 py-0.5 rounded bg-surface-muted text-[--text-muted]">{sk}</span>
                          ))}
                        </div>
                      </div>
                      {!isLocked && (
                        <ChevronRight className={`w-4 h-4 text-[--text-muted] transition-transform ${isSelected ? "rotate-90" : ""}`} />
                      )}
                    </div>

                    {/* Expanded */}
                    {isSelected && (
                      <div className="mt-4 pt-4 border-t border-surface-border animate-fade-in">
                        <p className="text-sm text-[--text-muted] leading-relaxed mb-4">{project.desc}</p>
                        <div className="flex gap-3">
                          {project.githubTemplate && (
                            <a href={project.githubTemplate} target="_blank" rel="noopener noreferrer"
                              className="btn-secondary text-sm flex items-center gap-1.5">
                              <GitBranch className="w-3.5 h-3.5" /> Use template
                            </a>
                          )}
                          {(project.status === "NOT_STARTED" || !project.status) && (
                            <a href="/projects" className="btn-primary text-sm">Submit project</a>
                          )}
                          {project.status !== "NOT_STARTED" && project.status !== "LOCKED" && (
                            <a href="/projects" className="btn-secondary text-sm">View submission</a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
