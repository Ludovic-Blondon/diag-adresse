import { Breadcrumbs } from "@/components/breadcrumbs";
import { Skeleton } from "@/components/ui/skeleton";

interface CommuneHeaderProps {
  name: string;
  codeInsee: string;
  depCode: string;
  depName?: string;
}

export function CommuneHeader({
  name,
  codeInsee,
  depCode,
  depName,
}: CommuneHeaderProps) {
  return (
    <div>
      <Breadcrumbs
        items={[
          ...(depName
            ? [{ name: depName, href: `/departement/${depCode}` }]
            : []),
          { name, href: `/commune/${codeInsee}` },
        ]}
      />
      <h1 className="mt-2 text-2xl font-bold">{name}</h1>
      <p className="text-muted-foreground text-sm">Code INSEE : {codeInsee}</p>
    </div>
  );
}

export function CommuneHeaderSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-40" />
    </div>
  );
}
