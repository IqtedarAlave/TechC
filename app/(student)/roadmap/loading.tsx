import { Skeleton } from "@/components/ui/Skeleton";

export default function StudentRoadmapLoading() {
  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-80" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Progress Card */}
      <div className="card space-y-3">
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-5 w-12" />
        </div>
        <Skeleton className="h-3 w-full rounded-full" />
      </div>

      {/* Level sections */}
      <div className="space-y-8">
        {["Foundation", "Intermediate", "Advanced"].map((level, i) => (
          <div key={i} className="space-y-4">
            <div className="flex items-center gap-3 border-b border-surface-border pb-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {Array.from({ length: 2 }).map((_, j) => (
                <div key={j} className="card space-y-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-5/6" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-12 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
