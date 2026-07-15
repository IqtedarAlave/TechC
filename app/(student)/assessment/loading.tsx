import { Skeleton } from "@/components/ui/Skeleton";

export default function StudentAssessmentLoading() {
  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Recommended tracks block skeleton */}
      <div className="card space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="grid md:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="p-4 rounded-xl border border-surface-border space-y-3">
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-3.5 w-full" />
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-8 w-20 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assessment tasks list */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-36" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card flex items-center justify-between gap-4 p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-3.5 w-64" />
              </div>
            </div>
            <Skeleton className="h-9 w-24 rounded-lg shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
