import { Skeleton } from "@/components/ui/Skeleton";

export default function EmployerDashboardLoading() {
  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-60" />
          <Skeleton className="h-4 w-80" />
        </div>
      </div>

      {/* Stats cards (Employer stats) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="stat-card space-y-2">
            <Skeleton className="h-9 w-9 rounded-xl" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>

      {/* Content layout (recent applications & active postings) */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-surface-border">
            <div className="space-y-1">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3 w-60" />
            </div>
          </div>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-4 p-3 rounded-xl bg-surface-muted/30">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card space-y-4">
          <div className="pb-2 border-b border-surface-border">
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-3 rounded-xl border border-surface-border space-y-2">
                <Skeleton className="h-4 w-40" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4.5 w-12 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
