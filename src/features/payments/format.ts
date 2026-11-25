const statusLabels = {
  succeeded: "Succeeded",
  pending: "Pending",
  failed: "Failed",
  refunded: "Refunded",
} as const;

const statusTones = {
  succeeded: "success",
  pending: "warning",
  failed: "danger",
  refunded: "info",
} as const;

export function formatStatus(status: string) {
  return statusLabels[status as keyof typeof statusLabels] ?? status;
}

export function statusTone(status: string) {
  return statusTones[status as keyof typeof statusTones] ?? "default";
}

export function formatAmount(amountMinor: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency.toUpperCase(),
    currencyDisplay: "code",
  }).format(amountMinor / 100);
}

export function formatCreated(seconds: number) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(seconds * 1000));
}

export function formatRelative(seconds: number, nowSeconds = Math.floor(Date.now() / 1000)) {
  const delta = nowSeconds - seconds;
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  const minute = 60;
  const hour = 3600;
  const day = 86400;
  if (Math.abs(delta) < minute) return rtf.format(-delta, "second");
  if (Math.abs(delta) < hour) return rtf.format(-Math.round(delta / minute), "minute");
  if (Math.abs(delta) < day) return rtf.format(-Math.round(delta / hour), "hour");
  return rtf.format(-Math.round(delta / day), "day");
}

export function formatUtc(seconds: number) {
  return new Date(seconds * 1000).toISOString();
}

export function maskLast4(last4: string | null) {
  return last4 ? `•••• ${last4}` : "—";
}
