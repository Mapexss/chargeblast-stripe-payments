import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { PaymentDetails } from "@/features/payments/components/PaymentDetails";
import { getPaymentById, listPaymentEvents } from "@/features/payments/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Payment ${id}`,
    description: `Details for payment ${id}`,
  };
}

async function PaymentDetailsContent({ id }: { id: string }) {
  const payment = getPaymentById(id);
  if (!payment) notFound();
  const events = listPaymentEvents(id);
  return <PaymentDetails payment={payment} events={events} />;
}

export default async function PaymentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="p-4 md:p-6">
      <Suspense
        fallback={
          <div className="space-y-3">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        }
      >
        <PaymentDetailsContent id={id} />
      </Suspense>
    </main>
  );
}
