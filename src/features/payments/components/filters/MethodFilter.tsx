"use client";

import { Button } from "@/components/ui/Button";
import { Popover } from "@/components/ui/Popover";
import type { PaymentFilters } from "@/features/payments/schema";

const options = ["card", "ach", "wallet"] as const;

export function MethodFilter({
  value,
  onChange,
}: {
  value: PaymentFilters["method"];
  onChange: (method: NonNullable<PaymentFilters["method"]>) => void;
}) {
  const selected = new Set(value ?? []);

  return (
    <Popover trigger={<Button variant="secondary" size="sm">Method</Button>}>
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <label key={option} className="flex h-10 items-center gap-2 text-sm text-text">
            <input
              type="checkbox"
              checked={selected.has(option)}
              onChange={(event) => {
                const next = new Set(selected);
                if (event.target.checked) next.add(option);
                else next.delete(option);
                onChange([...next]);
              }}
            />
            {option}
          </label>
        ))}
      </div>
    </Popover>
  );
}
