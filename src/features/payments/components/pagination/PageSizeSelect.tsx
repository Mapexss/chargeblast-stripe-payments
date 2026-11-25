"use client";

import { Select } from "@/components/ui/Select";

export function PageSizeSelect({
  value,
  onChange,
}: {
  value: 25 | 50 | 100;
  onChange: (value: 25 | 50 | 100) => void;
}) {
  return (
    <Select
      aria-label="Page size"
      value={String(value)}
      onValueChange={(next) => onChange(Number(next) as 25 | 50 | 100)}
      options={[
        { value: "25", label: "25" },
        { value: "50", label: "50" },
        { value: "100", label: "100" },
      ]}
      className="w-[5.5rem]"
    />
  );
}
