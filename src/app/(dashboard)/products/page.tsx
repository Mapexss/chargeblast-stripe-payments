import type { Metadata } from "next";
import { Suspense } from "react";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { serializeProduct } from "@/features/payments/api";
import { formatAmount } from "@/features/payments/format";
import { countProducts, listProducts } from "@/features/products/queries";

export const metadata: Metadata = {
  title: "Products",
  description: "Product catalog.",
};

async function ProductsContent() {
  const rows = listProducts(1, 100).map(serializeProduct);
  const total = countProducts();

  if (!rows.length) {
    return <p className="text-sm text-text-muted">No products yet.</p>;
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-text-muted">{total} products</p>
      <div className="overflow-x-auto rounded-[var(--radius-control)] border border-border">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-surface text-xs text-text-muted">
            <tr className="h-10 border-b border-border">
              <th className="px-3">Name</th>
              <th className="px-3">Price</th>
              <th className="px-3">Status</th>
              <th className="px-3">Description</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="h-12 border-b border-border last:border-b-0">
                <td className="px-3 text-text">{row.name}</td>
                <td className="px-3 font-mono tabular-nums text-text">
                  {formatAmount(row.price, row.currency)}
                </td>
                <td className="px-3">
                  <Badge tone={row.active ? "success" : "default"}>
                    {row.active ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="max-w-xs truncate px-3 text-text-muted">{row.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <main className="space-y-4 p-4 md:p-6">
      <h1 className="text-xl font-semibold text-text">Products</h1>
      <Suspense
        fallback={
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        }
      >
        <ProductsContent />
      </Suspense>
    </main>
  );
}
