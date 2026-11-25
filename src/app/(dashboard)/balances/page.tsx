import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Balances",
  description: "Available and pending balances.",
};

export default function BalancesPage() {
  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold text-text">Balances</h1>
      <p className="mt-2 text-sm text-text-muted">Balance summary arrives in a later task.</p>
    </main>
  );
}
