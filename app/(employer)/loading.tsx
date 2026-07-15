import { Skeleton } from "@/components/ui/Skeleton";

export default function EmployerLayoutLoading() {
  return (
    <div className="space-y-8 animate-fade-up">
      {/* Fallback Employer Layout Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="stat-card space-y-2">
            <Skeleton className="h-9 w-9 rounded-xl" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>

      {/* Large Table/List Skeleton */}
      <div className="card space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="border border-surface-border/50 rounded-xl overflow-hidden">
          <div className="bg-surface-muted/20 px-5 py-3 border-b border-surface-border">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="divide-y divide-surface-border">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="px-5 py-4 flex justify-between items-center">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
