import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminCompaniesLoading() {
  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Grid: Left column pending reviews list, Right column verified catalog */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card space-y-4">
          <Skeleton className="h-5 w-48 pb-2 border-b border-surface-border" />
          
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-4 p-3 rounded-xl bg-surface-muted/30">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Skeleton className="w-7 h-7 rounded-lg" />
                  <Skeleton className="w-7 h-7 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card space-y-4">
          <Skeleton className="h-5 w-40 pb-2 border-b border-surface-border" />
          
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-surface-muted/10 rounded-lg">
                <div className="space-y-1">
                  <Skeleton className="h-4.5 w-24" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
