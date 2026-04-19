import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Risk summary skeleton */}
      <section className="space-y-3">
        <Skeleton className="h-5 w-48" />
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-20 rounded-full" />
          ))}
        </div>
      </section>

      {/* Risk cards skeleton */}
      <section>
        <Skeleton className="mb-3 h-5 w-36" />
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3 rounded-lg border p-6">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </section>

      {/* Water skeleton */}
      <section>
        <Skeleton className="mb-3 h-5 w-48" />
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3 rounded-lg border p-6">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
        </div>
      </section>

      {/* DPE skeleton */}
      <section>
        <Skeleton className="mb-3 h-5 w-52" />
        <div className="space-y-3 rounded-lg border p-6">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-6 flex-1 rounded" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
