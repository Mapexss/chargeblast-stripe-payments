import { PaymentsTableSkeleton } from "@/features/payments/components/PaymentsTableSkeleton";

export default function PaymentsLoading() {
  return (
    <main className="space-y-4 p-4 md:p-6">
      <div className="h-7 w-32 rounded bg-border/70" />
      <PaymentsTableSkeleton />
    </main>
  );
}
