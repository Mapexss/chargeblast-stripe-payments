"use client";

import { AmountFilter } from "@/features/payments/components/filters/AmountFilter";
import { DateRangeFilter } from "@/features/payments/components/filters/DateRangeFilter";
import { FilterChips } from "@/features/payments/components/filters/FilterChips";
import { MethodFilter } from "@/features/payments/components/filters/MethodFilter";
import { SearchInput } from "@/features/payments/components/filters/SearchInput";
import { StatusFilter } from "@/features/payments/components/filters/StatusFilter";
import { StatusTabs } from "@/features/payments/components/filters/StatusTabs";
import { usePaymentFilters } from "@/features/payments/hooks/use-payment-filters";
import { parseFilters } from "@/features/payments/filters";

export function PaymentsFilterBar() {
  const { filters, setFilters } = usePaymentFilters();

  return (
    <div className="space-y-3">
      <StatusTabs
        value={filters.status}
        onChange={(status) => setFilters((current) => ({ ...current, status, page: 1 }))}
      />
      <div className="flex flex-wrap items-center gap-2">
        <SearchInput
          key={filters.q ?? ""}
          value={filters.q ?? ""}
          onChange={(q) =>
            setFilters((current) => ({
              ...current,
              q: q || undefined,
              page: 1,
            }))
          }
        />
        <DateRangeFilter
          range={filters.range}
          from={filters.from}
          to={filters.to}
          onChange={(next) => setFilters((current) => ({ ...current, ...next, page: 1 }))}
        />
        <StatusFilter
          value={filters.status}
          onChange={(status) => setFilters((current) => ({ ...current, status, page: 1 }))}
        />
        <MethodFilter
          value={filters.method}
          onChange={(method) => setFilters((current) => ({ ...current, method, page: 1 }))}
        />
        <AmountFilter
          amount_op={filters.amount_op}
          amount_value={filters.amount_value}
          amount_min={filters.amount_min}
          amount_max={filters.amount_max}
          currency={filters.currency}
          onChange={(next) => setFilters((current) => ({ ...current, ...next, page: 1 }))}
        />
      </div>
      <FilterChips
        filters={filters}
        onClear={() => setFilters(parseFilters(new URLSearchParams()))}
      />
    </div>
  );
}
