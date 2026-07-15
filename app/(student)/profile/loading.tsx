import { Skeleton } from "@/components/ui/Skeleton";

export default function StudentProfileLoading() {
  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* Form sections */}
      <div className="card space-y-6">
        {/* Name input */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>

        {/* Bio textarea */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>

        {/* Links grid */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>

        {/* Skills list input */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-16" />
          <div className="flex gap-2">
            <Skeleton className="h-10 flex-1 rounded-xl" />
            <Skeleton className="h-10 w-20 rounded-xl" />
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-16 rounded-full" />
            ))}
          </div>
        </div>

        {/* Save button */}
        <div className="pt-4">
          <Skeleton className="h-11 w-32 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
