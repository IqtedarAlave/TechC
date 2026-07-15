import { Skeleton } from "@/components/ui/Skeleton";

export default function StudentProjectsLoading() {
  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>

      {/* Submissions list skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-36" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-3.5 w-32" />
                </div>
              </div>
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>

            {/* Validation grid skeleton */}
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="p-3 rounded-xl bg-surface-muted/30 text-center space-y-2">
                  <Skeleton className="h-3 w-16 mx-auto" />
                  <Skeleton className="h-6 w-12 mx-auto" />
                </div>
              ))}
            </div>

            <Skeleton className="h-4 w-64" />
          </div>
        ))}
      </div>
    </div>
  );
}
