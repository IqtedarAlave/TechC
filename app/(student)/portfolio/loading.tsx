import { Skeleton } from "@/components/ui/Skeleton";

export default function StudentPortfolioLoading() {
  return (
    <div className="space-y-8 animate-fade-up">
      {/* Profile Header card skeleton */}
      <div className="card flex flex-col md:flex-row gap-6 items-start">
        <Skeleton className="w-20 h-20 rounded-2xl shrink-0" />
        <div className="flex-1 space-y-3 w-full">
          <div className="flex flex-wrap items-center gap-3">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-5 w-28 rounded-full" />
          </div>
          <Skeleton className="h-4 w-72" />
          <Skeleton className="h-4 w-full" />
          <div className="flex gap-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>

      {/* Skills card */}
      <div className="card space-y-4">
        <Skeleton className="h-6 w-24" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-16 rounded-full" />
          ))}
        </div>
      </div>

      {/* Badges section */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-36" />
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="card space-y-4 bg-accent-500/5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4.5 w-40" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <Skeleton className="h-5 w-24 rounded-full" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="h-12 rounded-xl bg-surface-muted/30" />
                ))}
              </div>
              <Skeleton className="h-9 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
