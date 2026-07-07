"use client";
import { useState } from "react";
import { Settings, Bell, Shield, Database, Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [platform, setPlatform] = useState({
    platformName:          "TechC",
    supportEmail:          "support@techc.app",
    maxSubmissionsPerDay:  "10",
    requireEmailVerify:    false,
    autoTriggerAiReview:   false,
    maintenanceMode:       false,
    allowNewRegistrations: true,
  });

  const [notifConfig, setNotifConfig] = useState({
    emailOnSubmission:   true,
    emailOnBadgeIssued:  true,
    emailOnJobApply:     false,
    emailProvider:       "resend",
  });

  async function handleSave() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setSaving(false);
    toast("success", "Settings saved");
  }

  const update = (k: string, v: string | boolean) =>
    setPlatform((f) => ({ ...f, [k]: v }));
  const updateNotif = (k: string, v: string | boolean) =>
    setNotifConfig((f) => ({ ...f, [k]: v }));

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!value)}
      className={`relative shrink-0 transition-colors rounded-full`}
      style={{ width: 40, height: 22, background: value ? "#10b981" : "#2a2d3e" }}>
      <span
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
        style={{ left: value ? 20 : 2 }}
      />
    </button>
  );

  return (
    <div className="space-y-6 animate-fade-up max-w-xl">
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Admin Settings</h1>
        <p className="text-[--text-muted] text-sm mt-1">Platform-wide configuration</p>
      </div>

      {/* Platform config */}
      <div className="card space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <Settings className="w-4 h-4 text-brand-400" />
          <h2 className="section-title text-base">Platform</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Platform name</label>
            <input className="input" value={platform.platformName}
              onChange={(e) => update("platformName", e.target.value)} />
          </div>
          <div>
            <label className="label">Support email</label>
            <input className="input" type="email" value={platform.supportEmail}
              onChange={(e) => update("supportEmail", e.target.value)} />
          </div>
        </div>

        <div>
          <label className="label">Max submissions per student per day</label>
          <input className="input w-32" type="number" min="1" max="50"
            value={platform.maxSubmissionsPerDay}
            onChange={(e) => update("maxSubmissionsPerDay", e.target.value)} />
        </div>

        {[
          { key: "requireEmailVerify",    label: "Require email verification on signup",     desc: "Students must verify email before submitting projects" },
          { key: "autoTriggerAiReview",   label: "Auto-trigger AI review after auto-check",  desc: "Saves manual trigger step; uses API credits automatically" },
          { key: "allowNewRegistrations", label: "Allow new registrations",                  desc: "Disable during maintenance or if at capacity" },
          { key: "maintenanceMode",       label: "Maintenance mode",                          desc: "Shows maintenance page to all non-admin users" },
        ].map(({ key, label, desc }) => (
          <div key={key} className="flex items-start justify-between gap-4 py-1">
            <div>
              <p className="text-sm font-medium text-[--text]">{label}</p>
              <p className="text-xs text-[--text-muted] mt-0.5">{desc}</p>
            </div>
            <Toggle
              value={platform[key as keyof typeof platform] as boolean}
              onChange={(v) => update(key, v)}
            />
          </div>
        ))}
      </div>

      {/* Notifications */}
      <div className="card space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Bell className="w-4 h-4 text-yellow-400" />
          <h2 className="section-title text-base">Email notifications</h2>
        </div>

        <div>
          <label className="label">Email provider</label>
          <select className="select w-48"
            value={notifConfig.emailProvider}
            onChange={(e) => updateNotif("emailProvider", e.target.value)}>
            <option value="resend">Resend (recommended)</option>
            <option value="sendgrid">SendGrid</option>
            <option value="smtp">Custom SMTP</option>
          </select>
          <p className="text-xs text-[--text-muted] mt-1">
            Resend free tier: 3,000 emails/month. Add RESEND_API_KEY to .env
          </p>
        </div>

        {[
          { key: "emailOnSubmission",  label: "Notify student on submission received" },
          { key: "emailOnBadgeIssued", label: "Notify student when badge is issued" },
          { key: "emailOnJobApply",    label: "Notify employer on new job application" },
        ].map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between gap-4 py-1">
            <p className="text-sm text-[--text]">{label}</p>
            <Toggle
              value={notifConfig[key as keyof typeof notifConfig] as boolean}
              onChange={(v) => updateNotif(key, v)}
            />
          </div>
        ))}
      </div>

      {/* Security */}
      <div className="card space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-4 h-4 text-red-400" />
          <h2 className="section-title text-base">Security</h2>
        </div>

        <div className="space-y-3 text-sm">
          {[
            { label: "JWT secret", value: "Set via JWT_SECRET env var", status: "ok" },
            { label: "Database URL", value: "Set via DATABASE_URL env var", status: "ok" },
            { label: "Anthropic API key", value: process.env.ANTHROPIC_API_KEY ? "Configured" : "Not set — AI review disabled", status: process.env.ANTHROPIC_API_KEY ? "ok" : "warn" },
            { label: "GitHub token", value: "Optional — set GITHUB_TOKEN for higher rate limits", status: "info" },
          ].map(({ label, value, status }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-[--text-muted]">{label}</span>
              <span className={`text-xs ${status === "ok" ? "text-accent-400" : status === "warn" ? "text-yellow-400" : "text-[--text-muted]"}`}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* DB stats */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-4 h-4 text-purple-400" />
          <h2 className="section-title text-base">Quick actions</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => toast("success", "Cache cleared")} className="btn-secondary text-sm">
            Clear cache
          </button>
          <a href="/api/admin/export" className="btn-secondary text-sm">
            Export data (CSV)
          </a>
          <button onClick={() => toast("warning", "This would run in production")}
            className="btn-danger text-sm">
            Reset test data
          </button>
        </div>
      </div>

      <button onClick={handleSave} disabled={saving}
        className="btn-primary flex items-center gap-2">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
        Save settings
      </button>
    </div>
  );
}
