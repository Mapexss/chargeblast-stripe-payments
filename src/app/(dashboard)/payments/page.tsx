import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Suspense } from "react";
import { listEnvelope, serializePayment } from "@/features/payments/api";
import { serializeFilters, parseFilters } from "@/features/payments/filters";
import { PaymentsTable } from "@/features/payments/components/PaymentsTable";
import { PaymentsTableSkeleton } from "@/features/payments/components/PaymentsTableSkeleton";
import { paymentsQueryKey } from "@/features/payments/hooks/use-payments-query";
import { countPayments, listPayments } from "@/features/payments/queries";
import { QueryProvider } from "@/components/providers/QueryProvider";

export const metadata: Metadata = {
  title: "Payments",
  description: "Stripe Dashboard payments list.",
};

async function PaymentsContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters = parseFilters(params);
  const rows = listPayments(filters).map(serializePayment);
  const totalCount = countPayments(filters);
  const query = serializeFilters(filters).toString();
  const envelope = listEnvelope({
    data: rows,
    totalCount,
    page: filters.page,
    pageSize: filters.page_size,
    url: `/api/stripe/v1/payments${query ? `?${query}` : ""}`,
  });

  const client = new QueryClient();
  client.setQueryData(paymentsQueryKey(filters), envelope);

  return (
    <QueryProvider>
      <HydrationBoundary state={dehydrate(client)}>
        <PaymentsTable />
      </HydrationBoundary>
    </QueryProvider>
  );
}

export default function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <main className="space-y-4 p-4 md:p-6">
      <h1 className="text-xl font-semibold text-text">Payments</h1>
      <Suspense fallback={<PaymentsTableSkeleton />}>
        <PaymentsContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
