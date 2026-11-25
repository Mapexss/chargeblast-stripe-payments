import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customers",
  description: "Customer directory.",
};

export default function CustomersPage() {
  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold text-text">Customers</h1>
      <p className="mt-2 text-sm text-text-muted">Customer list arrives in a later task.</p>
    </main>
  );
}
