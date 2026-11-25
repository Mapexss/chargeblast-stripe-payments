import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { serializeCustomer } from "@/features/payments/api";
import { countCustomers, listCustomers } from "@/features/customers/queries";
import { formatCreated } from "@/features/payments/format";

export const metadata: Metadata = {
  title: "Customers",
  description: "Customer directory.",
};

async function CustomersContent() {
  const rows = listCustomers(1, 100).map(serializeCustomer);
  const total = countCustomers();

  if (!rows.length) {
    return <p className="text-sm text-text-muted">No customers yet.</p>;
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-text-muted">{total} customers</p>
      <div className="overflow-x-auto rounded-[var(--radius-control)] border border-border">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead className="bg-surface text-xs text-text-muted">
            <tr className="h-10 border-b border-border">
              <th className="px-3">Name</th>
              <th className="px-3">Email</th>
              <th className="px-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="h-12 border-b border-border last:border-b-0">
                <td className="px-3 text-text">{row.name}</td>
                <td className="px-3 text-text-muted">{row.email}</td>
                <td className="px-3 text-text-muted">{formatCreated(row.created)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function CustomersPage() {
  return (
    <main className="space-y-4 p-4 md:p-6">
      <h1 className="text-xl font-semibold text-text">Customers</h1>
      <Suspense
        fallback={
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        }
      >
        <CustomersContent />
      </Suspense>
    </main>
  );
}
