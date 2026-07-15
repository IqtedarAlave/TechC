import { Skeleton } from "@/components/ui/Skeleton";

export default function EmployerStudentsLoading() {
  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Skeleton className="h-10 flex-1 rounded-xl" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-28 rounded-xl" />
          <Skeleton className="h-10 w-24 rounded-xl" />
        </div>
      </div>

      {/* Talent Catalog Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card space-y-4">
            <div className="flex gap-3 items-start">
              <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4.5 w-36" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
            <Skeleton className="h-3.5 w-full" />
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-surface-border">
              {Array.from({ length: 4 }).map((_, j) => (
                <Skeleton key={j} className="h-5 w-12 rounded-full" />
              ))}
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Skeleton className="h-9 w-24 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
