import { Skeleton } from "@/components/ui/skeleton";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <DashboardSkeleton />
    </main>
  );
}
