import { Skeleton } from "@/components/ui/Skeleton";

export default function EmployerSettingsLoading() {
  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Settings form skeleton */}
      <div className="card space-y-6">
        <Skeleton className="h-5 w-40 border-b border-surface-border pb-2" />

        {/* Form fields */}
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

        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>

        <div className="pt-2">
          <Skeleton className="h-11 w-32 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
