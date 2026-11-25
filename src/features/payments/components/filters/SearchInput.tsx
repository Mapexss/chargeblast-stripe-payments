"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";

export function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [text, setText] = useState(value);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      if (text !== value) onChange(text);
    }, 300);
    return () => window.clearTimeout(handle);
  }, [text, value, onChange]);

  return (
    <Input
      value={text}
      onChange={(event) => setText(event.target.value)}
      placeholder="Search ID, email, or last4"
      aria-label="Search payments"
      className="max-w-sm"
    />
  );
}
