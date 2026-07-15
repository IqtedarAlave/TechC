import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminSubmissionsLoading() {
  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Submissions queue skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-3 w-56" />
                </div>
              </div>
              <Skeleton className="h-10 w-28 rounded-xl" />
            </div>

            {/* Validation info block */}
            <div className="grid md:grid-cols-2 gap-4 pt-3 border-t border-surface-border">
              <div className="space-y-2 p-3 rounded-xl bg-surface-muted/30">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3.5 w-full" />
              </div>
              <div className="space-y-2 p-3 rounded-xl bg-surface-muted/30">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3.5 w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
