import { Breadcrumbs } from "@/components/breadcrumbs";
import { communePath } from "@/lib/commune-url";

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
          { name, href: communePath(codeInsee, name) },
        ]}
      />
      <h1 className="mt-2 text-2xl font-bold">{name}</h1>
      <p className="text-muted-foreground text-sm">Code INSEE : {codeInsee}</p>
    </div>
  );
}
