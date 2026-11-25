"use client";

import { PaymentCard } from "@/features/payments/components/PaymentCard";
import { PaymentRow } from "@/features/payments/components/PaymentRow";
import { PaymentsTableSkeleton } from "@/features/payments/components/PaymentsTableSkeleton";
import { usePaymentFilters } from "@/features/payments/hooks/use-payment-filters";
import { usePaymentsQuery } from "@/features/payments/hooks/use-payments-query";

export function PaymentsTable() {
  const { filters } = usePaymentFilters();
  const query = usePaymentsQuery(filters);
  const payments = query.data?.data ?? [];

  if (query.isPending && !query.data) {
    return <PaymentsTableSkeleton />;
  }

  return (
    <div className="relative">
      {query.isFetching ? (
        <div className="absolute inset-x-0 top-0 z-10 h-0.5 overflow-hidden bg-border">
          <div className="h-full w-1/3 animate-pulse bg-accent" />
        </div>
      ) : null}

      <div className="hidden overflow-x-auto rounded-[var(--radius-control)] border border-border md:block">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead className="bg-surface text-xs font-medium text-text-muted">
            <tr className="h-10 border-b border-border">
              <th className="px-3 text-right">Amount</th>
              <th className="px-3">Status</th>
              <th className="px-3">Customer</th>
              <th className="px-3">Method</th>
              <th className="px-3">Description</th>
              <th className="px-3">Created</th>
              <th className="w-10 px-1" />
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <PaymentRow key={payment.id} payment={payment} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {payments.map((payment) => (
          <PaymentCard key={payment.id} payment={payment} />
        ))}
      </div>

      {payments.length === 0 ? (
        <p className="py-10 text-center text-sm text-text-muted">No payments match these filters.</p>
      ) : null}
    </div>
  );
}
