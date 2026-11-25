"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Tooltip } from "@/components/ui/Tooltip";

export function CopyPaymentId({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(id);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <Tooltip content={copied ? "Copied!" : id}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 px-2 font-mono text-xs text-text-muted"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void copy();
        }}
        aria-label={`Copy payment id ${id}`}
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      </Button>
    </Tooltip>
  );
}
