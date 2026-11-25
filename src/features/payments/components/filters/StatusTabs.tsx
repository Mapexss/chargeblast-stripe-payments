"use client";

import { cn } from "@/lib/cn";
import type { PaymentFilters } from "@/features/payments/schema";

const tabs = [
  { key: "all", label: "All", status: undefined },
  { key: "succeeded", label: "Succeeded", status: ["succeeded"] },
  { key: "refunded", label: "Refunded", status: ["refunded"] },
  { key: "failed", label: "Failed", status: ["failed"] },
] as const;

export function StatusTabs({
  value,
  onChange,
}: {
  value: PaymentFilters["status"];
  onChange: (status: PaymentFilters["status"]) => void;
}) {
  const active =
    value?.length === 1
      ? value[0]
      : !value?.length
        ? "all"
        : "custom";

  return (
    <div className="flex flex-wrap gap-1" role="tablist" aria-label="Status">
      {tabs.map((tab) => {
        const selected =
          tab.key === "all" ? active === "all" : active === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={selected}
            className={cn(
              "h-10 min-h-10 rounded-[var(--radius-control)] px-3 text-sm font-medium",
              selected
                ? "bg-accent/10 text-accent"
                : "text-text-muted hover:bg-surface hover:text-text",
            )}
            onClick={() => onChange(tab.status ? [...tab.status] : [])}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
