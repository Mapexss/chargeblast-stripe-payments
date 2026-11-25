"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { parseFilters, serializeFilters } from "../filters";
import type { PaymentFilters } from "../schema";

export function usePaymentFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => parseFilters(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );

  const setFilters = useCallback(
    (next: PaymentFilters | ((current: PaymentFilters) => PaymentFilters)) => {
      const resolved = typeof next === "function" ? next(filters) : next;
      const query = serializeFilters(resolved).toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [filters, pathname, router],
  );

  return { filters, setFilters };
}
