"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import type { PaymentFilters } from "@/features/payments/schema";

function chipsFor(filters: PaymentFilters) {
  const chips: { key: string; label: string }[] = [];
  if (filters.q) chips.push({ key: "q", label: `Search: ${filters.q}` });
  if (filters.status?.length) {
    chips.push({ key: "status", label: `Status: ${filters.status.join(", ")}` });
  }
  if (filters.method?.length) {
    chips.push({ key: "method", label: `Method: ${filters.method.join(", ")}` });
  }
  if (filters.range) chips.push({ key: "range", label: `Range: ${filters.range}` });
  if (filters.amount_op) {
    chips.push({
      key: "amount",
      label: `Amount ${filters.amount_op} (${filters.currency ?? "—"})`,
    });
  }
  return chips;
}

export function FilterChips({
  filters,
  onClear,
}: {
  filters: PaymentFilters;
  onClear: () => void;
}) {
  const chips = chipsFor(filters);
  if (!chips.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <AnimatePresence initial={false}>
        {chips.map((chip) => (
          <motion.span
            key={chip.key}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="rounded-[var(--radius-pill)] bg-surface px-2 py-1 text-xs text-text"
          >
            {chip.label}
          </motion.span>
        ))}
      </AnimatePresence>
      <Button variant="ghost" size="sm" onClick={onClear}>
        Clear filters
      </Button>
    </div>
  );
}
