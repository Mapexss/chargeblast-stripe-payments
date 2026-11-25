import { Badge } from "@/components/ui/Badge";
import { CopyPaymentId } from "@/features/payments/components/CopyPaymentId";
import {
  formatAmount,
  formatCreated,
  formatStatus,
  formatUtc,
  maskLast4,
  statusTone,
} from "@/features/payments/format";
import type { PaymentRecord } from "@/features/payments/api";

type EventRow = {
  id: string;
  type: string;
  createdAt: number;
  message: string;
};

export function PaymentDetails({
  payment,
  events,
}: {
  payment: PaymentRecord;
  events: EventRow[];
}) {
  const metadata = JSON.parse(payment.metadata || "{}") as Record<string, string>;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono text-2xl font-semibold tabular-nums text-text">
              {formatAmount(payment.amountMinor, payment.currency)}
            </h1>
            <Badge tone={statusTone(payment.status) as "success"}>
              {formatStatus(payment.status)}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-text-muted">{payment.description}</p>
        </div>
        <CopyPaymentId id={payment.id} />
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[var(--radius-control)] border border-border p-4">
          <h2 className="mb-3 text-sm font-semibold text-text">Amount summary</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-text-muted">Amount</dt>
              <dd className="font-mono tabular-nums">{formatAmount(payment.amountMinor, payment.currency)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-text-muted">Fee</dt>
              <dd className="font-mono tabular-nums">{formatAmount(payment.feeMinor, payment.currency)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-text-muted">Net</dt>
              <dd className="font-mono tabular-nums">{formatAmount(payment.netMinor, payment.currency)}</dd>
            </div>
            {payment.refundedAmountMinor ? (
              <div className="flex justify-between gap-3">
                <dt className="text-text-muted">Refunded</dt>
                <dd className="font-mono tabular-nums">
                  {formatAmount(payment.refundedAmountMinor, payment.currency)}
                </dd>
              </div>
            ) : null}
          </dl>
        </div>

        <div className="rounded-[var(--radius-control)] border border-border p-4">
          <h2 className="mb-3 text-sm font-semibold text-text">Payment method</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-text-muted">Type</dt>
              <dd>{payment.paymentMethodType}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-text-muted">Brand</dt>
              <dd>{payment.brand ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-text-muted">Number</dt>
              <dd className="font-mono">{maskLast4(payment.last4)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-text-muted">Funding</dt>
              <dd>{payment.funding ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-text-muted">Customer</dt>
              <dd className="truncate text-right">
                {payment.customerName}
                <span className="block text-[12px] text-text-muted">{payment.customerEmail}</span>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="rounded-[var(--radius-control)] border border-border p-4">
        <h2 className="mb-3 text-sm font-semibold text-text">Timeline</h2>
        <ol className="space-y-3">
          {events.map((event) => (
            <li key={event.id} className="border-l-2 border-border pl-3">
              <div className="text-sm font-medium text-text">{event.type}</div>
              <div className="text-[12px] text-text-muted">{event.message}</div>
              <div className="text-[12px] text-text-muted">
                {formatCreated(event.createdAt)} · {formatUtc(event.createdAt)}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-[var(--radius-control)] border border-border p-4">
        <h2 className="mb-3 text-sm font-semibold text-text">Metadata</h2>
        <table className="w-full text-sm">
          <tbody>
            {Object.entries(metadata).map(([key, value]) => (
              <tr key={key} className="border-t border-border first:border-t-0">
                <th className="py-2 pr-4 text-left font-medium text-text-muted">{key}</th>
                <td className="py-2 font-mono text-text">{value}</td>
              </tr>
            ))}
            {Object.keys(metadata).length === 0 ? (
              <tr>
                <td className="py-2 text-text-muted">No metadata</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </div>
  );
}
