import { Skeleton } from "@/components/ui/Skeleton";

export default function StudentSettingsLoading() {
  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Account Settings Card */}
      <div className="card space-y-6">
        <Skeleton className="h-6 w-48 border-b border-surface-border pb-2" />
        
        {/* Toggle Option Row */}
        <div className="flex items-center justify-between py-2">
          <div className="space-y-2">
            <Skeleton className="h-4.5 w-40" />
            <Skeleton className="h-3 w-72" />
          </div>
          <Skeleton className="h-6 w-11 rounded-full" />
        </div>

        {/* Change password section */}
        <div className="space-y-4 pt-4 border-t border-surface-border">
          <Skeleton className="h-5 w-40" />
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
