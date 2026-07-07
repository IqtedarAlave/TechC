"use client";
import { useState } from "react";
import { CheckCircle, XCircle, Search, Building2, Globe, Shield, MoreVertical, Clock } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";

type Company = {
  id: string; name: string; industry: string; size: string;
  location: string; website?: string; contactEmail: string;
  isVerified: boolean; joinedAt: string; activeJobs: number;
};

const INITIAL: Company[] = [
  { id: "1", name: "Shajgoj Tech", industry: "E-commerce", size: "51–200", location: "Dhaka", website: "https://shajgoj.com", contactEmail: "hr@shajgoj.com", isVerified: true, joinedAt: "May 20", activeJobs: 2 },
  { id: "2", name: "Acme Technologies", industry: "Software / IT", size: "11–50", location: "Dhaka", contactEmail: "hr@acme.tech", isVerified: false, joinedAt: "Jun 8", activeJobs: 0 },
  { id: "3", name: "Maya Technologies", industry: "Healthcare Tech", size: "11–50", location: "Dhaka", website: "https://maya.com.bd", contactEmail: "careers@maya.com.bd", isVerified: false, joinedAt: "Jun 9", activeJobs: 0 },
  { id: "4", name: "10 Minute School", industry: "EdTech", size: "51–200", location: "Dhaka", website: "https://10minuteschool.com", contactEmail: "hr@10ms.com", isVerified: true, joinedAt: "May 15", activeJobs: 1 },
  { id: "5", name: "bKash Limited", industry: "Fintech", size: "500+", location: "Dhaka", website: "https://bkash.com", contactEmail: "careers@bkash.com", isVerified: true, joinedAt: "May 1", activeJobs: 0 },
  { id: "6", name: "Startup BD", industry: "Software / IT", size: "1–10", location: "Chittagong", contactEmail: "team@startupbd.io", isVerified: false, joinedAt: "Jun 14", activeJobs: 0 },
];

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>(INITIAL);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "VERIFIED">("ALL");
  const [action, setAction] = useState<{ id: string; type: "verify" | "reject" } | null>(null);
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const filtered = companies.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q);
    const matchFilter = filter === "ALL" || (filter === "PENDING" && !c.isVerified) || (filter === "VERIFIED" && c.isVerified);
    return matchSearch && matchFilter;
  });

  async function handleAction() {
    if (!action) return;
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 800));
    if (action.type === "verify") {
      setCompanies((prev) => prev.map((c) => c.id === action.id ? { ...c, isVerified: true } : c));
      toast("success", "Company verified — they can now post live listings");
    } else {
      setCompanies((prev) => prev.filter((c) => c.id !== action.id));
      toast("success", "Company rejected and removed");
    }
    setAction(null);
    setProcessing(false);
  }

  const pending = companies.filter((c) => !c.isVerified).length;
  const verified = companies.filter((c) => c.isVerified).length;

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Companies</h1>
        <p className="text-[--text-muted] text-sm mt-1">
          {verified} verified · {pending} pending review
        </p>
      </div>

      {/* Pending alert */}
      {pending > 0 && (
        <div className="card border-yellow-500/20 bg-yellow-500/5 flex items-center gap-3">
          <Clock className="w-5 h-5 text-yellow-400 shrink-0" />
          <p className="text-sm text-yellow-300">
            {pending} company {pending === 1 ? "account needs" : "accounts need"} your review before going live.
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[--text-muted]" />
          <input className="input pl-9" placeholder="Search companies…"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        {(["ALL", "PENDING", "VERIFIED"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-xs px-3 py-2 rounded-xl border font-medium transition-all
              ${filter === f ? "bg-brand-500/10 border-brand-500/30 text-brand-300"
                : "border-surface-border text-[--text-muted] hover:border-surface-muted"}`}>
            {f} {f === "PENDING" && pending > 0 && <span className="ml-1 badge-yellow text-[10px] px-1.5">{pending}</span>}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-border">
              {["Company", "Industry", "Size", "Contact", "Status", "Actions"].map((h) => (
                <th key={h} className="text-left text-xs font-medium text-[--text-muted] px-5 py-3.5">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr key={c.id}
                className={`border-b border-surface-border/50 hover:bg-surface-muted/20 transition-colors
                  ${i === filtered.length - 1 ? "border-b-0" : ""}`}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-300 font-bold text-xs shrink-0">
                      {c.name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-[--text]">{c.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <p className="text-xs text-[--text-muted]">{c.location}</p>
                        {c.website && (
                          <a href={c.website} target="_blank"
                            className="text-[--text-muted] hover:text-brand-400 transition-colors">
                            <Globe className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <p className="text-xs text-[--text-muted]">{c.industry}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="text-xs text-[--text-muted]">{c.size}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="text-xs text-[--text-muted] truncate max-w-[140px]">{c.contactEmail}</p>
                  <p className="text-[10px] text-[--text-muted]">Joined {c.joinedAt}</p>
                </td>
                <td className="px-5 py-4">
                  {c.isVerified ? (
                    <span className="badge-green text-[10px] flex items-center gap-1 w-fit">
                      <Shield className="w-2.5 h-2.5" /> Verified
                    </span>
                  ) : (
                    <span className="badge-yellow text-[10px]">Pending</span>
                  )}
                </td>
                <td className="px-5 py-4">
                  {!c.isVerified ? (
                    <div className="flex gap-1.5">
                      <button onClick={() => setAction({ id: c.id, type: "verify" })}
                        className="w-7 h-7 rounded-lg bg-accent-500/10 text-accent-400 hover:bg-accent-500/20 flex items-center justify-center transition-colors"
                        title="Verify company">
                        <CheckCircle className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setAction({ id: c.id, type: "reject" })}
                        className="w-7 h-7 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-colors"
                        title="Reject company">
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button className="w-7 h-7 rounded-lg hover:bg-surface-muted flex items-center justify-center text-[--text-muted] hover:text-[--text] transition-colors">
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-[--text-muted] text-sm">No companies match your filter.</div>
        )}
      </div>

      <ConfirmDialog
        open={!!action}
        title={action?.type === "verify" ? "Verify this company?" : "Reject this company?"}
        message={action?.type === "verify"
          ? "This will allow the company to post live job listings visible to all students."
          : "This will remove the company account and notify them. They can re-apply."}
        confirmLabel={action?.type === "verify" ? "Verify" : "Reject & remove"}
        danger={action?.type === "reject"}
        loading={processing}
        onConfirm={handleAction}
        onCancel={() => setAction(null)}
      />
    </div>
  );
}
