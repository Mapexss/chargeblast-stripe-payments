"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Tooltip } from "@/components/ui/Tooltip";
import { CopyPaymentId } from "@/features/payments/components/CopyPaymentId";
import {
  formatAmount,
  formatCreated,
  formatRelative,
  formatStatus,
  formatUtc,
  maskLast4,
  statusTone,
} from "@/features/payments/format";
import type { PaymentWire } from "@/features/payments/types";

export function PaymentRow({ payment }: { payment: PaymentWire }) {
  const methodTip = [
    payment.payment_method.funding,
    payment.payment_method.exp_month && payment.payment_method.exp_year
      ? `${payment.payment_method.exp_month}/${payment.payment_method.exp_year}`
      : null,
    payment.payment_method.cvc_check ? `CVC ${payment.payment_method.cvc_check}` : null,
    payment.payment_method.wallet,
  ]
    .filter(Boolean)
    .join(" · ");

  const statusTip =
    payment.failure_message ||
    (payment.refunded_amount
      ? `Refunded ${formatAmount(payment.refunded_amount, payment.currency)}`
      : formatStatus(payment.status));

  return (
    <tr className="group h-12 border-b border-border hover:bg-surface/80">
      <td className="px-3 text-right font-mono text-sm tabular-nums text-text">
        <Link href={`/payments/${payment.id}`} className="block">
          {formatAmount(payment.amount, payment.currency)}
          {payment.refunded_amount ? (
            <span className="block text-[12px] text-text-muted">
              −{formatAmount(payment.refunded_amount, payment.currency)}
            </span>
          ) : null}
        </Link>
      </td>
      <td className="px-3">
        <Tooltip content={statusTip}>
          <span>
            <Badge tone={statusTone(payment.status) as "success"}>
              {formatStatus(payment.status)}
            </Badge>
          </span>
        </Tooltip>
      </td>
      <td className="px-3 text-sm">
        <div className="truncate text-text">{payment.customer.name}</div>
        <div className="truncate text-[12px] text-text-muted">{payment.customer.email}</div>
      </td>
      <td className="px-3 text-sm text-text">
        <Tooltip content={methodTip || payment.payment_method.type}>
          <span className="inline-flex items-center gap-2">
            <span className="uppercase text-text-muted">{payment.payment_method.brand ?? payment.payment_method.type}</span>
            <span className="font-mono">{maskLast4(payment.payment_method.last4)}</span>
          </span>
        </Tooltip>
      </td>
      <td className="max-w-[14rem] truncate px-3 text-sm text-text">{payment.description}</td>
      <td className="px-3 text-sm text-text-muted">
        <Tooltip content={`${formatRelative(payment.created)} · ${formatUtc(payment.created)}`}>
          <span>{formatCreated(payment.created)}</span>
        </Tooltip>
      </td>
      <td className="w-10 px-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
        <CopyPaymentId id={payment.id} />
      </td>
    </tr>
  );
}
