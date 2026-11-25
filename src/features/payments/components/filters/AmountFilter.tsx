"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Popover } from "@/components/ui/Popover";
import { Select } from "@/components/ui/Select";
import type { PaymentFilters } from "@/features/payments/schema";

export function AmountFilter({
  amount_op,
  amount_value,
  amount_min,
  amount_max,
  currency,
  onChange,
}: {
  amount_op: PaymentFilters["amount_op"];
  amount_value: number | undefined;
  amount_min: number | undefined;
  amount_max: number | undefined;
  currency: PaymentFilters["currency"];
  onChange: (next: Partial<PaymentFilters>) => void;
}) {
  return (
    <Popover trigger={<Button variant="secondary" size="sm">Amount</Button>}>
      <div className="flex flex-col gap-2">
        <Select
          aria-label="Currency"
          value={currency ?? "usd"}
          onValueChange={(value) =>
            onChange({ currency: value as PaymentFilters["currency"] })
          }
          options={[
            { value: "usd", label: "USD" },
            { value: "eur", label: "EUR" },
            { value: "brl", label: "BRL" },
            { value: "gbp", label: "GBP" },
          ]}
        />
        <Select
          aria-label="Amount operator"
          value={amount_op ?? "eq"}
          onValueChange={(value) =>
            onChange({ amount_op: value as PaymentFilters["amount_op"] })
          }
          options={[
            { value: "eq", label: "Equal to" },
            { value: "gt", label: "Greater than" },
            { value: "lt", label: "Less than" },
            { value: "between", label: "Between" },
          ]}
        />
        {amount_op === "between" ? (
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min (cents)"
              value={amount_min ?? ""}
              onChange={(event) =>
                onChange({
                  amount_min: event.target.value ? Number(event.target.value) : undefined,
                })
              }
            />
            <Input
              type="number"
              placeholder="Max (cents)"
              value={amount_max ?? ""}
              onChange={(event) =>
                onChange({
                  amount_max: event.target.value ? Number(event.target.value) : undefined,
                })
              }
            />
          </div>
        ) : (
          <Input
            type="number"
            placeholder="Amount (cents)"
            value={amount_value ?? ""}
            onChange={(event) =>
              onChange({
                amount_value: event.target.value ? Number(event.target.value) : undefined,
                amount_op: amount_op ?? "eq",
              })
            }
          />
        )}
      </div>
    </Popover>
  );
}
