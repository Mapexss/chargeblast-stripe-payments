"use client";

import { Button } from "@/components/ui/Button";
import { Popover } from "@/components/ui/Popover";
import type { PaymentFilters } from "@/features/payments/schema";

function startOfDaySeconds(date: Date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return Math.floor(copy.getTime() / 1000);
}

function endOfDaySeconds(date: Date) {
  const copy = new Date(date);
  copy.setHours(23, 59, 59, 999);
  return Math.floor(copy.getTime() / 1000);
}

function presetBounds(range: "today" | "7d" | "30d") {
  const now = new Date();
  const to = endOfDaySeconds(now);
  if (range === "today") return { from: startOfDaySeconds(now), to };
  const fromDate = new Date(now);
  fromDate.setDate(fromDate.getDate() - (range === "7d" ? 6 : 29));
  return { from: startOfDaySeconds(fromDate), to };
}

export function DateRangeFilter({
  range,
  from,
  to,
  onChange,
}: {
  range: PaymentFilters["range"];
  from: number | undefined;
  to: number | undefined;
  onChange: (next: {
    range: PaymentFilters["range"];
    from?: number;
    to?: number;
  }) => void;
}) {
  return (
    <Popover
      trigger={
        <Button variant="secondary" size="sm">
          {range === "today"
            ? "Today"
            : range === "7d"
              ? "Last 7 days"
              : range === "30d"
                ? "Last 30 days"
                : range === "custom"
                  ? "Custom range"
                  : "Date"}
        </Button>
      }
    >
      <div className="flex flex-col gap-2">
        {(
          [
            ["today", "Today"],
            ["7d", "Last 7 days"],
            ["30d", "Last 30 days"],
          ] as const
        ).map(([key, label]) => (
          <Button
            key={key}
            variant="ghost"
            className="justify-start"
            onClick={() => onChange({ range: key, ...presetBounds(key) })}
          >
            {label}
          </Button>
        ))}
        <label className="text-xs text-text-muted">
          From
          <input
            type="date"
            className="mt-1 flex h-10 w-full rounded-[var(--radius-control)] border border-border bg-bg px-2 text-sm text-text"
            value={from ? new Date(from * 1000).toISOString().slice(0, 10) : ""}
            onChange={(event) => {
              const value = event.target.value
                ? startOfDaySeconds(new Date(event.target.value))
                : undefined;
              onChange({ range: "custom", from: value, to });
            }}
          />
        </label>
        <label className="text-xs text-text-muted">
          To
          <input
            type="date"
            className="mt-1 flex h-10 w-full rounded-[var(--radius-control)] border border-border bg-bg px-2 text-sm text-text"
            value={to ? new Date(to * 1000).toISOString().slice(0, 10) : ""}
            onChange={(event) => {
              const value = event.target.value
                ? endOfDaySeconds(new Date(event.target.value))
                : undefined;
              onChange({ range: "custom", from, to: value });
            }}
          />
        </label>
      </div>
    </Popover>
  );
}
