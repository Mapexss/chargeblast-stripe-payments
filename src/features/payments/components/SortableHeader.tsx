"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/cn";
import type { PaymentFilters } from "@/features/payments/schema";

export function SortableHeader({
  label,
  field,
  sort,
  direction,
  align = "left",
  onSort,
}: {
  label: string;
  field: PaymentFilters["sort"];
  sort: PaymentFilters["sort"];
  direction: PaymentFilters["direction"];
  align?: "left" | "right";
  onSort: (field: PaymentFilters["sort"]) => void;
}) {
  const active = sort === field;
  const Icon = !active ? ArrowUpDown : direction === "asc" ? ArrowUp : ArrowDown;

  return (
    <th className={cn("px-3", align === "right" && "text-right")}>
      <button
        type="button"
        className={cn(
          "inline-flex h-10 min-h-10 items-center gap-1 text-xs font-medium",
          active ? "text-text" : "text-text-muted hover:text-text",
          align === "right" && "ml-auto",
        )}
        onClick={() => onSort(field)}
      >
        {label}
        <Icon className="size-3.5" aria-hidden />
      </button>
    </th>
  );
}
