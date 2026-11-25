"use client";

import { PaymentCard } from "@/features/payments/components/PaymentCard";
import { PaymentRow } from "@/features/payments/components/PaymentRow";
import { PaymentsTableSkeleton } from "@/features/payments/components/PaymentsTableSkeleton";
import { PaginationFooter } from "@/features/payments/components/pagination/PaginationFooter";
import { SortableHeader } from "@/features/payments/components/SortableHeader";
import { usePaymentFilters } from "@/features/payments/hooks/use-payment-filters";
import { usePaymentsQuery } from "@/features/payments/hooks/use-payments-query";
import type { PaymentFilters } from "@/features/payments/schema";

export function PaymentsTable() {
  const { filters, setFilters } = usePaymentFilters();
  const query = usePaymentsQuery(filters);
  const payments = query.data?.data ?? [];
  const totalCount = query.data?.total_count ?? 0;

  function onSort(field: PaymentFilters["sort"]) {
    setFilters((current) => {
      if (current.sort === field) {
        return {
          ...current,
          direction: current.direction === "asc" ? "desc" : "asc",
          page: 1,
        };
      }
      return { ...current, sort: field, direction: "desc", page: 1 };
    });
  }

  if (query.isPending && !query.data) {
    return <PaymentsTableSkeleton />;
  }

  return (
    <div className="relative space-y-4">
      {query.isFetching ? (
        <div className="absolute inset-x-0 top-0 z-10 h-0.5 overflow-hidden bg-border">
          <div className="h-full w-1/3 animate-pulse bg-accent" />
        </div>
      ) : null}

      <div className="hidden overflow-x-auto rounded-[var(--radius-control)] border border-border md:block">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead className="bg-surface text-xs font-medium text-text-muted">
            <tr className="h-10 border-b border-border">
              <SortableHeader
                label="Amount"
                field="amount"
                sort={filters.sort}
                direction={filters.direction}
                align="right"
                onSort={onSort}
              />
              <SortableHeader
                label="Status"
                field="status"
                sort={filters.sort}
                direction={filters.direction}
                onSort={onSort}
              />
              <th className="px-3">Customer</th>
              <th className="px-3">Method</th>
              <th className="px-3">Description</th>
              <SortableHeader
                label="Created"
                field="created"
                sort={filters.sort}
                direction={filters.direction}
                onSort={onSort}
              />
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

      <PaginationFooter
        page={filters.page}
        pageSize={filters.page_size}
        totalCount={totalCount}
        onPageChange={(page) => setFilters((current) => ({ ...current, page }))}
        onPageSizeChange={(page_size) =>
          setFilters((current) => ({ ...current, page_size, page: 1 }))
        }
      />
    </div>
  );
}
