"use client";
import { useState } from "react";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

type PendingCompany = {
  id: string;
  companyName: string;
  industry: string;
  location: string;
  createdAt: Date | string;
};

export function PendingCompaniesList({ initialCompanies }: { initialCompanies: PendingCompany[] }) {
  const [companies, setCompanies] = useState<PendingCompany[]>(initialCompanies);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { toast } = useToast();

  async function handleAction(id: string, action: "verify" | "reject") {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/admin/companies/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast("error", data.message || `Failed to ${action} company`);
        return;
      }

      toast("success", action === "verify" ? "Company verified successfully!" : "Company registration rejected.");
      setCompanies((prev) => prev.filter((c) => c.id !== id));
    } catch {
      toast("error", "An error occurred. Please try again.");
    } finally {
      setProcessingId(null);
    }
  }

  function formatTimeAgo(dateInput: Date | string) {
    const date = new Date(dateInput);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  }

  return (
    <div className="space-y-3">
      {companies.map((c) => (
        <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-muted/50 hover:bg-surface-muted transition-colors">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-300 font-bold text-sm shrink-0">
            {c.companyName[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[--text] truncate">{c.companyName}</p>
            <p className="text-xs text-[--text-muted]">{c.industry} · {c.location}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            {processingId === c.id ? (
              <Loader2 className="w-5 h-5 animate-spin text-[--text-muted] m-1" />
            ) : (
              <>
                <button
                  onClick={() => handleAction(c.id, "verify")}
                  className="w-7 h-7 rounded-lg bg-accent-500/10 text-accent-400 hover:bg-accent-500/20 flex items-center justify-center transition-colors"
                  title="Verify Company"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleAction(c.id, "reject")}
                  className="w-7 h-7 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-colors"
                  title="Reject Company"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      ))}
      {companies.length === 0 && (
        <p className="text-sm text-[--text-muted] italic py-4 text-center">No companies awaiting verification</p>
      )}
    </div>
  );
}
