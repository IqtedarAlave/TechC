"use client";
import { useState } from "react";
import { Loader2, Eye, EyeOff, Bell, Shield, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export default function SettingsPage() {
  const { toast } = useToast();
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const [notifs, setNotifs] = useState({
    jobMatches: true,
    submissionUpdates: true,
    mentorFeedback: true,
    weeklyDigest: false,
  });

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (pwForm.next !== pwForm.confirm) {
      toast("error", "New passwords don't match"); return;
    }
    if (pwForm.next.length < 8) {
      toast("error", "New password must be at least 8 characters"); return;
    }
    setSavingPw(true);
    try {
      const res = await fetch("/api/profile/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current: pwForm.current, next: pwForm.next }),
      });
      if (res.ok) {
        toast("success", "Password changed successfully");
        setPwForm({ current: "", next: "", confirm: "" });
      } else {
        const d = await res.json();
        toast("error", d.message || "Failed to change password");
      }
    } catch {
      toast("error", "Something went wrong");
    } finally {
      setSavingPw(false);
    }
  }

  async function handleDeleteAccount() {
    setDeletingAccount(true);
    await new Promise((r) => setTimeout(r, 1500));
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <div className="space-y-6 animate-fade-up max-w-lg">
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Settings</h1>
        <p className="text-[--text-muted] text-sm mt-1">Manage your account preferences</p>
      </div>

      {/* Change password */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-brand-400" />
          <h2 className="section-title text-base">Change password</h2>
        </div>
        <form onSubmit={handleChangePassword} className="space-y-3">
          {[
            { label: "Current password", key: "current" },
            { label: "New password", key: "next" },
            { label: "Confirm new password", key: "confirm" },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="label">{label}</label>
              <div className="relative">
                <input className="input pr-10"
                  type={showPw ? "text" : "password"}
                  value={pwForm[key as keyof typeof pwForm]}
                  onChange={(e) => setPwForm((f) => ({ ...f, [key]: e.target.value }))}
                  placeholder="••••••••" required />
                {key === "current" && (
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[--text-muted] hover:text-[--text]">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>
          ))}
          <button type="submit" disabled={savingPw}
            className="btn-primary text-sm flex items-center gap-2">
            {savingPw && <Loader2 className="w-4 h-4 animate-spin" />}
            Update password
          </button>
        </form>
      </div>

      {/* Notification preferences */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-4 h-4 text-yellow-400" />
          <h2 className="section-title text-base">Notifications</h2>
        </div>
        <div className="space-y-3">
          {[
            { key: "submissionUpdates", label: "Submission status updates", desc: "When your project moves through validation layers" },
            { key: "mentorFeedback", label: "Mentor feedback", desc: "When a mentor approves or reviews your submission" },
            { key: "jobMatches", label: "Job matches", desc: "When new listings match your career path" },
            { key: "weeklyDigest", label: "Weekly digest", desc: "Summary of your progress and new opportunities" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-start justify-between gap-4 py-2">
              <div>
                <p className="text-sm font-medium text-[--text]">{label}</p>
                <p className="text-xs text-[--text-muted] mt-0.5">{desc}</p>
              </div>
              <button
                onClick={() => setNotifs((n) => ({ ...n, [key]: !n[key as keyof typeof notifs] }))}
                className={`relative w-10 h-5.5 rounded-full transition-colors shrink-0 mt-0.5
                  ${notifs[key as keyof typeof notifs] ? "bg-accent-500" : "bg-surface-muted"}`}
                style={{ height: "22px", width: "40px" }}>
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all
                  ${notifs[key as keyof typeof notifs] ? "left-5" : "left-0.5"}`} />
              </button>
            </div>
          ))}
        </div>
        <button onClick={() => toast("success", "Notification preferences saved")}
          className="btn-secondary text-sm mt-4">
          Save preferences
        </button>
      </div>

      {/* Danger zone */}
      <div className="card border-red-500/20">
        <div className="flex items-center gap-2 mb-4">
          <Trash2 className="w-4 h-4 text-red-400" />
          <h2 className="section-title text-base text-red-400">Danger zone</h2>
        </div>
        <p className="text-sm text-[--text-muted] mb-4">
          Deleting your account removes your profile, all submissions, and earned badges permanently.
          This cannot be undone.
        </p>
        <button onClick={() => setShowDelete(true)} className="btn-danger text-sm">
          Delete my account
        </button>
      </div>

      <ConfirmDialog
        open={showDelete}
        title="Delete your account?"
        message="This will permanently delete your profile, all project submissions, and any earned badges. This cannot be undone."
        confirmLabel="Yes, delete my account"
        danger
        loading={deletingAccount}
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  );
}
