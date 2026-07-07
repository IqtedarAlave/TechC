"use client";
import { useState } from "react";
import { Loader2, Building2, Shield, Bell } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

const INDUSTRIES = [
  "Software / IT", "Fintech", "E-commerce", "Telecom",
  "Healthcare Tech", "EdTech", "NGO / Development", "Media & Creative", "Gaming", "Other",
];

const INITIAL = {
  companyName: "Acme Technologies Ltd.",
  website: "https://acme.tech",
  industry: "Software / IT",
  size: "11–50",
  location: "Dhaka",
  description: "We build productivity tools for BD teams.",
  contactName: "Rafiqul Islam",
  contactEmail: "hr@acme.tech",
};

export default function EmployerSettingsPage() {
  const [form, setForm] = useState(INITIAL);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    toast("success", "Company profile updated");
  }

  return (
    <div className="space-y-6 animate-fade-up max-w-lg">
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Company Settings</h1>
        <p className="text-[--text-muted] text-sm mt-1">Update your company profile and preferences</p>
      </div>

      {/* Verification status */}
      <div className="card border-yellow-500/20 bg-yellow-500/5 flex items-center gap-3">
        <Shield className="w-5 h-5 text-yellow-400 shrink-0" />
        <div>
          <p className="text-sm font-medium text-yellow-300">Verification pending</p>
          <p className="text-xs text-[--text-muted] mt-0.5">
            TechC is reviewing your company profile. You can still post jobs; they go live once verified.
          </p>
        </div>
      </div>

      {/* Company profile form */}
      <form onSubmit={handleSave} className="space-y-4">
        <div className="card space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-4 h-4 text-brand-400" />
            <h2 className="section-title text-base">Company profile</h2>
          </div>

          <div>
            <label className="label">Company name</label>
            <input className="input" value={form.companyName} onChange={(e) => update("companyName", e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Industry</label>
              <select className="select" value={form.industry} onChange={(e) => update("industry", e.target.value)}>
                {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Team size</label>
              <select className="select" value={form.size} onChange={(e) => update("size", e.target.value)}>
                {["1–10", "11–50", "51–200", "201–500", "500+"].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Website</label>
              <input className="input" type="url" value={form.website} onChange={(e) => update("website", e.target.value)} />
            </div>
            <div>
              <label className="label">Location</label>
              <input className="input" value={form.location} onChange={(e) => update("location", e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label">About your company</label>
            <textarea className="input resize-none" rows={3} value={form.description}
              onChange={(e) => update("description", e.target.value)} />
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="section-title text-base mb-1">Contact info</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Contact name</label>
              <input className="input" value={form.contactName} onChange={(e) => update("contactName", e.target.value)} />
            </div>
            <div>
              <label className="label">Contact email</label>
              <input className="input" type="email" value={form.contactEmail} onChange={(e) => update("contactEmail", e.target.value)} />
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          Save changes
        </button>
      </form>
    </div>
  );
}
