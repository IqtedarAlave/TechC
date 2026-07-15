import { Skeleton } from "@/components/ui/Skeleton";

export default function StudentJobsLoading() {
  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-60" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* Filter layout skeleton */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24 rounded-xl" />
          <Skeleton className="h-10 w-28 rounded-xl" />
        </div>
      </div>

      {/* Job list skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-11 h-11 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-56" />
                  <Skeleton className="h-3.5 w-40" />
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-3.5 w-16" />
              </div>
            </div>
            
            <Skeleton className="h-4 w-5/6" />

            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
