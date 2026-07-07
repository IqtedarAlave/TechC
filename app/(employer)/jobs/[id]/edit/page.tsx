"use client";
import { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/Toast";

export default function EditJobPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "Junior Frontend Developer",
    description: "Join our product team building scalable web apps.",
    salaryRange: "20,000–30,000 BDT",
    location: "Dhaka",
    deadline: "",
  });
  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setSaving(false);
    toast("success", "Listing updated");
  }

  return (
    <div className="max-w-lg animate-fade-up">
      <Link href="/employer/jobs" className="inline-flex items-center gap-1.5 text-sm text-[--text-muted] hover:text-[--text] mb-6">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to listings
      </Link>
      <h1 className="text-2xl font-display font-bold text-white mb-6">Edit listing</h1>
      <div className="card">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="label">Job title</label>
            <input className="input" value={form.title} onChange={(e) => update("title", e.target.value)} required />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input resize-none" rows={5} value={form.description}
              onChange={(e) => update("description", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Salary range</label>
              <input className="input" value={form.salaryRange} onChange={(e) => update("salaryRange", e.target.value)} />
            </div>
            <div>
              <label className="label">Location</label>
              <input className="input" value={form.location} onChange={(e) => update("location", e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label">Deadline</label>
            <input className="input" type="date" value={form.deadline} onChange={(e) => update("deadline", e.target.value)} />
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? "Saving…" : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
