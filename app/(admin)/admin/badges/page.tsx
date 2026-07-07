"use client";
import { useState } from "react";
import { Shield, Search, ExternalLink, Trash2, Copy } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";

type Badge = {
  id: string; uid: string; student: string; university: string;
  projectTitle: string; path: string; difficulty: string;
  autoScore: number; aiScore: number; issuedAt: string;
};

const INITIAL_BADGES: Badge[] = [
  { id: "1", uid: "tc_a3f9d2b1e7", student: "Rafi Islam", university: "BUET", projectTitle: "Portfolio Website", path: "Web Dev", difficulty: "Junior", autoScore: 92, aiScore: 89, issuedAt: "Jun 1" },
  { id: "2", uid: "tc_b8e2f5c4d1", student: "Sumaiya Khatun", university: "SUST", projectTitle: "Docker CI/CD Pipeline", path: "DevOps", difficulty: "Mid", autoScore: 90, aiScore: 87, issuedAt: "Jun 3" },
  { id: "3", uid: "tc_c7d3a9e6f2", student: "Nabil Ahmed", university: "IUT", projectTitle: "Real-Time Chat App", path: "Web Dev", difficulty: "Mid", autoScore: 95, aiScore: 92, issuedAt: "Jun 5" },
  { id: "4", uid: "tc_d4f1b7c3e8", student: "Tasnim Akter", university: "NSU", projectTitle: "CNN Image Classifier", path: "AI/ML", difficulty: "Junior", autoScore: 88, aiScore: 85, issuedAt: "Jun 7" },
];

const DIFFICULTY_BADGE: Record<string, string> = {
  Junior: "badge-blue", Mid: "badge-yellow", Senior: "badge-green",
};

export default function AdminBadgesPage() {
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [search, setSearch] = useState("");
  const [revokeTarget, setRevokeTarget] = useState<string | null>(null);
  const [revoking, setRevoking] = useState(false);
  const { toast } = useToast();

  const filtered = badges.filter((b) => {
    const q = search.toLowerCase();
    return b.student.toLowerCase().includes(q) ||
      b.projectTitle.toLowerCase().includes(q) ||
      b.path.toLowerCase().includes(q) ||
      b.uid.includes(q);
  });

  async function handleRevoke() {
    if (!revokeTarget) return;
    setRevoking(true);
    await new Promise((r) => setTimeout(r, 800));
    setBadges((prev) => prev.filter((b) => b.id !== revokeTarget));
    setRevokeTarget(null);
    setRevoking(false);
    toast("success", "Badge revoked and removed from student portfolio");
  }

  function copyUid(uid: string) {
    navigator.clipboard.writeText(`techc.app/verify/${uid}`);
    toast("success", "Verify URL copied");
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Issued Badges</h1>
        <p className="text-[--text-muted] text-sm mt-1">
          {badges.length} badges issued · each is publicly verifiable
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total issued", value: badges.length, color: "text-accent-400" },
          { label: "Unique students", value: new Set(badges.map((b) => b.student)).size, color: "text-brand-400" },
          { label: "Career paths", value: new Set(badges.map((b) => b.path)).size, color: "text-purple-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="card text-center py-4">
            <p className={`text-2xl font-bold font-display ${color}`}>{value}</p>
            <p className="text-xs text-[--text-muted] mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[--text-muted]" />
        <input className="input pl-9" placeholder="Search by student, project, UID, or path…"
          value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Badge list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="card text-center py-12 text-[--text-muted] text-sm">No badges match your search.</div>
        )}

        {filtered.map((b) => (
          <div key={b.id} className="card hover:border-accent-500/20 transition-colors">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent-500/20 flex items-center justify-center text-accent-400 shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-[--text]">{b.projectTitle}</p>
                  <p className="text-xs text-[--text-muted]">{b.student} · {b.university}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={DIFFICULTY_BADGE[b.difficulty]}>{b.difficulty}</span>
                <span className="badge-muted text-[10px]">{b.path}</span>
              </div>
            </div>

            {/* Scores */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center p-2 rounded-lg bg-surface-muted">
                <p className="text-sm font-bold text-brand-300">{b.autoScore}</p>
                <p className="text-[10px] text-[--text-muted]">Auto</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-surface-muted">
                <p className="text-sm font-bold text-purple-300">{b.aiScore}</p>
                <p className="text-[10px] text-[--text-muted]">AI</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-accent-500/10">
                <p className="text-sm font-bold text-accent-400">✓</p>
                <p className="text-[10px] text-[--text-muted]">Mentor</p>
              </div>
            </div>

            {/* UID + actions */}
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-surface-muted rounded-xl px-3 py-2 flex items-center gap-2 min-w-0">
                <Shield className="w-3 h-3 text-accent-400 shrink-0" />
                <span className="text-[10px] font-mono text-accent-300 truncate">techc.app/verify/{b.uid}</span>
              </div>
              <button onClick={() => copyUid(b.uid)}
                className="w-8 h-8 rounded-lg bg-surface-muted flex items-center justify-center text-[--text-muted] hover:text-[--text] transition-colors shrink-0"
                title="Copy verify URL">
                <Copy className="w-3.5 h-3.5" />
              </button>
              <a href={`/verify/${b.uid}`} target="_blank"
                className="w-8 h-8 rounded-lg bg-surface-muted flex items-center justify-center text-[--text-muted] hover:text-[--text] transition-colors shrink-0">
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button onClick={() => setRevokeTarget(b.id)}
                className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-colors shrink-0"
                title="Revoke badge">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-[10px] text-[--text-muted] mt-2">Issued {b.issuedAt}</p>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!revokeTarget}
        title="Revoke this badge?"
        message="The badge will be removed from the student's portfolio and the verify URL will return invalid. This cannot be undone."
        confirmLabel="Revoke badge"
        danger loading={revoking}
        onConfirm={handleRevoke}
        onCancel={() => setRevokeTarget(null)}
      />
    </div>
  );
}
