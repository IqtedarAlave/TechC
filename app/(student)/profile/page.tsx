"use client";
import { useState, useEffect } from "react";
import { Github, Linkedin, Globe, Edit3, Save, X, Loader2, User, GraduationCap, Code2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

const SKILLS_OPTIONS = [
  "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Express",
  "Python", "Django", "FastAPI", "PostgreSQL", "MongoDB", "Redis",
  "Docker", "Git", "Linux", "Tailwind CSS", "HTML/CSS",
  "TensorFlow", "PyTorch", "Pandas", "NumPy", "scikit-learn",
  "C", "C++", "Arduino", "FPGA", "Embedded C",
  "Figma", "UI/UX", "AWS", "GitHub Actions", "REST API", "GraphQL",
];

const CAREER_PATH_LABELS: Record<string, string> = {
  WEB_DEV: "Web Development", AI_ML: "AI / Machine Learning",
  CYBERSECURITY: "Cybersecurity", EMBEDDED_SYSTEMS: "Embedded Systems",
  DATA_SCIENCE: "Data Science", UI_UX: "UI / UX Design", DEVOPS: "DevOps",
};

const INITIAL = {
  name: "",
  username: "",
  email: "",
  university: "",
  department: "",
  graduationYear: 2025,
  careerPath: "",
  bio: "",
  githubUrl: "",
  linkedinUrl: "",
  portfolioUrl: "",
  skills: [] as string[],
  isPublic: true,
};

export default function ProfilePage() {
  const [form, setForm] = useState(INITIAL);
  const [initialData, setInitialData] = useState(INITIAL);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            const student = data.user.studentProfile || {};
            const profileData = {
              name: data.user.name || "",
              username: student.username || "",
              email: data.user.email || "",
              university: student.university || "",
              department: student.department || "",
              graduationYear: student.graduationYear || 2025,
              careerPath: student.careerPath || "",
              bio: student.bio || "",
              githubUrl: student.githubUrl || "",
              linkedinUrl: student.linkedinUrl || "",
              portfolioUrl: student.portfolioUrl || "",
              skills: student.skills || [],
              isPublic: student.isPublic !== false,
            };
            setForm(profileData);
            setInitialData(profileData);
          }
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const update = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  function addSkill(sk: string) {
    const s = sk.trim();
    if (!s || form.skills.includes(s) || form.skills.length >= 12) return;
    setForm((f) => ({ ...f, skills: [...f.skills, s] }));
    setSkillInput("");
  }

  function removeSkill(sk: string) {
    setForm((f) => ({ ...f, skills: f.skills.filter((x) => x !== sk) }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast("success", "Profile updated successfully");
        setInitialData(form);
        setEditing(false);
      } else {
        const d = await res.json();
        toast("error", d.message || "Failed to save");
      }
    } catch {
      toast("error", "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-[--text-muted]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        <p className="text-sm">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-up max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">My Profile</h1>
          <p className="text-[--text-muted] text-sm mt-1">
            This is what employers see at{" "}
            <a href={`/u/${form.username}`} target="_blank"
              className="text-brand-400 hover:text-brand-300">
              techc.app/u/{form.username}
            </a>
          </p>
        </div>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="btn-secondary flex items-center gap-2 text-sm">
            <Edit3 className="w-4 h-4" /> Edit profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => { setEditing(false); setForm(initialData); }}
              className="btn-ghost text-sm flex items-center gap-1.5">
              <X className="w-4 h-4" /> Cancel
            </button>
            <button onClick={handleSave} disabled={saving}
              className="btn-primary text-sm flex items-center gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save
            </button>
          </div>
        )}
      </div>

      {/* Visibility toggle */}
      <div className="card flex items-center justify-between gap-4 py-4">
        <div>
          <p className="text-sm font-medium text-[--text]">Public portfolio</p>
          <p className="text-xs text-[--text-muted] mt-0.5">
            {form.isPublic ? "Visible to employers and search engines" : "Hidden — only you can see it"}
          </p>
        </div>
        <button onClick={() => update("isPublic", !form.isPublic)}
          className={`relative w-11 h-6 rounded-full transition-colors ${form.isPublic ? "bg-accent-500" : "bg-surface-muted"}`}>
          <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${form.isPublic ? "left-6" : "left-1"}`} />
        </button>
      </div>

      {/* Basic info */}
      <div className="card space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <User className="w-4 h-4 text-brand-400" />
          <h2 className="section-title text-base">Basic info</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Full name</label>
            {editing ? (
              <input className="input" value={form.name} onChange={(e) => update("name", e.target.value)} />
            ) : (
              <p className="text-sm text-[--text] py-2.5">{form.name}</p>
            )}
          </div>
          <div>
            <label className="label">Username</label>
            <p className="text-sm text-[--text-muted] py-2.5 flex items-center gap-1">
              techc.app/u/<span className="text-[--text]">{form.username}</span>
            </p>
          </div>
        </div>

        <div>
          <label className="label">Bio</label>
          {editing ? (
            <textarea className="input resize-none" rows={3} maxLength={200}
              value={form.bio} onChange={(e) => update("bio", e.target.value)}
              placeholder="Brief intro — what you build, what you're interested in" />
          ) : (
            <p className="text-sm text-[--text] py-2 leading-relaxed">{form.bio || <span className="text-[--text-muted] italic">No bio yet</span>}</p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "GitHub URL", key: "githubUrl", icon: Github, placeholder: "https://github.com/username" },
            { label: "LinkedIn URL", key: "linkedinUrl", icon: Linkedin, placeholder: "https://linkedin.com/in/..." },
            { label: "Personal site", key: "portfolioUrl", icon: Globe, placeholder: "https://yoursite.com" },
          ].map(({ label, key, icon: Icon, placeholder }) => (
            <div key={key}>
              <label className="label flex items-center gap-1.5">
                <Icon className="w-3 h-3" /> {label}
              </label>
              {editing ? (
                <input className="input text-xs" value={form[key as keyof typeof form] as string}
                  onChange={(e) => update(key, e.target.value)} placeholder={placeholder} />
              ) : (
                <p className="text-xs text-brand-400 py-2.5 truncate">
                  {(form[key as keyof typeof form] as string) || <span className="text-[--text-muted]">Not set</span>}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Academic info */}
      <div className="card space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <GraduationCap className="w-4 h-4 text-purple-400" />
          <h2 className="section-title text-base">Academic info</h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="label">University</label>
            <p className="text-sm text-[--text] py-2.5">{form.university}</p>
          </div>
          <div>
            <label className="label">Department</label>
            <p className="text-sm text-[--text] py-2.5">{form.department}</p>
          </div>
          <div>
            <label className="label">Graduation</label>
            <p className="text-sm text-[--text] py-2.5">{form.graduationYear}</p>
          </div>
        </div>
        <div>
          <label className="label">Career path</label>
          <p className="text-sm text-[--text] py-2.5">
            {CAREER_PATH_LABELS[form.careerPath] || form.careerPath}
          </p>
          {editing && (
            <p className="text-xs text-[--text-muted] mt-1">
              To change your career path, contact support (path changes affect your roadmap).
            </p>
          )}
        </div>
      </div>

      {/* Skills */}
      <div className="card space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Code2 className="w-4 h-4 text-accent-400" />
          <h2 className="section-title text-base">Skills</h2>
          <span className="text-xs text-[--text-muted] ml-auto">{form.skills.length}/12</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {form.skills.map((sk) => (
            <span key={sk} className="badge-blue flex items-center gap-1.5">
              {sk}
              {editing && (
                <button onClick={() => removeSkill(sk)} className="hover:text-red-400 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
          {form.skills.length === 0 && (
            <p className="text-sm text-[--text-muted] italic">No skills added yet</p>
          )}
        </div>

        {editing && (
          <div>
            <label className="label">Add a skill</label>
            <div className="flex gap-2">
              <input className="input flex-1" placeholder="e.g. React" value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSkill(skillInput)} />
              <button onClick={() => addSkill(skillInput)} className="btn-secondary text-sm px-4">Add</button>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {SKILLS_OPTIONS.filter((s) => !form.skills.includes(s)).slice(0, 15).map((s) => (
                <button key={s} onClick={() => addSkill(s)}
                  className="text-[10px] px-2 py-1 rounded-lg bg-surface-muted text-[--text-muted] hover:text-[--text] hover:bg-surface-border transition-colors">
                  + {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
