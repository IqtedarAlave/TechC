import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminBadgesLoading() {
  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Badges database catalog table/list */}
      <div className="card space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64 rounded-xl" />
        </div>

        <div className="border border-surface-border/50 rounded-xl overflow-hidden">
          <div className="bg-surface-muted/20 px-5 py-3 border-b border-surface-border">
            <div className="grid grid-cols-4 gap-4">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
          <div className="divide-y divide-surface-border">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="px-5 py-4 grid grid-cols-4 gap-4 items-center">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-5 w-20 rounded-full" />
                <div className="flex justify-end">
                  <Skeleton className="h-8 w-16 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
