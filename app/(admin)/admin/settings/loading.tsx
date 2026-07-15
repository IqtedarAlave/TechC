import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminSettingsLoading() {
  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Admin Settings Form */}
      <div className="card space-y-6">
        <Skeleton className="h-5 w-44 border-b border-surface-border pb-2" />

        {/* Setting Toggle Options */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2.5 border-b border-surface-border/50 last:border-0">
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-80" />
              </div>
              <Skeleton className="h-6 w-11 rounded-full shrink-0" />
            </div>
          ))}
        </div>

        {/* Input configs */}
        <div className="space-y-4 pt-4 border-t border-surface-border">
          <Skeleton className="h-5 w-40" />
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Skeleton className="h-11 w-32 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
