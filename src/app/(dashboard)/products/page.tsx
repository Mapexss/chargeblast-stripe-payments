import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
  description: "Product catalog.",
};

export default function ProductsPage() {
  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold text-text">Products</h1>
      <p className="mt-2 text-sm text-text-muted">Product catalog arrives in a later task.</p>
    </main>
  );
}
