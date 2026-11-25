"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { CopyPaymentId } from "@/features/payments/components/CopyPaymentId";
import {
  formatAmount,
  formatCreated,
  formatStatus,
  maskLast4,
  statusTone,
} from "@/features/payments/format";
import type { PaymentWire } from "@/features/payments/types";

export function PaymentCard({ payment }: { payment: PaymentWire }) {
  return (
    <article className="rounded-[var(--radius-control)] border border-border bg-bg p-3">
      <div className="flex items-start justify-between gap-2">
        <Link href={`/payments/${payment.id}`} className="min-w-0">
          <div className="font-mono text-sm tabular-nums text-text">
            {formatAmount(payment.amount, payment.currency)}
          </div>
          <div className="truncate text-sm text-text">{payment.customer.name}</div>
          <div className="truncate text-[12px] text-text-muted">{payment.customer.email}</div>
        </Link>
        <div className="flex items-center gap-1">
          <Badge tone={statusTone(payment.status) as "success"}>
            {formatStatus(payment.status)}
          </Badge>
          <CopyPaymentId id={payment.id} />
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-text-muted">
        <span className="font-mono">{maskLast4(payment.payment_method.last4)}</span>
        <span className="truncate">{payment.description}</span>
        <span>{formatCreated(payment.created)}</span>
      </div>
    </article>
  );
}
