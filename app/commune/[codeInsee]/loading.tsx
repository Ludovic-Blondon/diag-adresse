import { Skeleton } from "@/components/ui/skeleton";
import { CommuneHeaderSkeleton } from "@/components/commune-header";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8">
      <CommuneHeaderSkeleton />
      <Skeleton className="h-10 w-full rounded-md" />
      <DashboardSkeleton />
    </main>
  );
}
