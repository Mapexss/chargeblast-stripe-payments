import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { serializeBalance } from "@/features/payments/api";
import { formatAmount } from "@/features/payments/format";
import { countBalances, listBalances } from "@/features/balances/queries";

export const metadata: Metadata = {
  title: "Balances",
  description: "Available and pending balances.",
};

async function BalancesContent() {
  const rows = listBalances(1, 100).map(serializeBalance);
  const total = countBalances();

  if (!rows.length) {
    return <p className="text-sm text-text-muted">No balances yet.</p>;
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-text-muted">{total} currencies</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {rows.map((row) => (
          <article
            key={row.currency}
            className="rounded-[var(--radius-control)] border border-border bg-bg p-4"
          >
            <h2 className="text-sm font-semibold uppercase text-text">{row.currency}</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-text-muted">Available</dt>
                <dd className="font-mono tabular-nums text-text">
                  {formatAmount(row.available, row.currency)}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-text-muted">Pending</dt>
                <dd className="font-mono tabular-nums text-text">
                  {formatAmount(row.pending, row.currency)}
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function BalancesPage() {
  return (
    <main className="space-y-4 p-4 md:p-6">
      <h1 className="text-xl font-semibold text-text">Balances</h1>
      <Suspense
        fallback={
          <div className="grid gap-3 sm:grid-cols-2">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
        }
      >
        <BalancesContent />
      </Suspense>
    </main>
  );
}
