"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { serializeFilters } from "../filters";
import type { PaymentFilters } from "../schema";
import type { PaymentsListResponse } from "../types";
import { stripeFetch } from "@/lib/stripe-client";

export function paymentsQueryKey(filters: PaymentFilters) {
  return ["payments", serializeFilters(filters).toString()] as const;
}

export function usePaymentsQuery(filters: PaymentFilters) {
  const query = serializeFilters(filters).toString();
  const path = `/api/stripe/v1/payments${query ? `?${query}` : ""}`;

  return useQuery({
    queryKey: paymentsQueryKey(filters),
    queryFn: () => stripeFetch<PaymentsListResponse>(path),
    placeholderData: keepPreviousData,
  });
}
