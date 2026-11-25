import { Skeleton } from "@/components/ui/Skeleton";

export function PaymentsTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-control)] border border-border">
      <div className="hidden h-10 items-center gap-3 border-b border-border bg-surface px-3 md:flex">
        <Skeleton className="ml-auto h-3 w-16" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-3 w-28" />
      </div>
      <div className="hidden md:block">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="flex h-12 items-center gap-3 border-b border-border px-3 last:border-b-0">
            <Skeleton className="ml-auto h-3 w-20" />
            <Skeleton className="h-5 w-16 rounded-[var(--radius-pill)]" />
            <div className="w-36 space-y-1">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-2.5 w-24" />
            </div>
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>
      <div className="space-y-3 p-3 md:hidden">
        {Array.from({ length: Math.min(rows, 4) }).map((_, index) => (
          <Skeleton key={index} className="h-24 w-full" />
        ))}
      </div>
    </div>
  );
}
