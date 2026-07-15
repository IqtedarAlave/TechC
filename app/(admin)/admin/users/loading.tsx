import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminUsersLoading() {
  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Users table card */}
      <div className="card space-y-4">
        {/* Search bar placeholder */}
        <Skeleton className="h-10 w-64 rounded-xl" />

        <div className="border border-surface-border/50 rounded-xl overflow-hidden">
          <div className="bg-surface-muted/20 px-5 py-3 border-b border-surface-border">
            <div className="grid grid-cols-5 gap-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
          <div className="divide-y divide-surface-border">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-5 py-4 grid grid-cols-5 gap-4 items-center">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3.5 w-40" />
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-3.5 w-32" />
                <div className="flex gap-2">
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
