import { Skeleton } from "@/components/ui/Skeleton";

export default function StudentBadgesLoading() {
  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Badges Grid skeleton */}
      <div className="grid md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card space-y-4 border-accent-500/20 bg-accent-500/5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div className="space-y-1.5">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>

            {/* Validation score breakdown */}
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="text-center p-3 rounded-xl bg-surface-muted/30 space-y-1.5">
                  <Skeleton className="h-5 w-8 mx-auto" />
                  <Skeleton className="h-3 w-16 mx-auto" />
                </div>
              ))}
            </div>

            <div className="h-10 rounded-xl bg-surface-muted/20 border border-surface-border flex items-center px-3">
              <Skeleton className="h-3.5 w-48" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
