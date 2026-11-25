import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const tones = {
  default: "bg-surface text-text-muted border-border",
  success: "bg-success text-success-fg border-transparent",
  warning: "bg-warning text-warning-fg border-transparent",
  danger: "bg-danger text-danger-fg border-transparent",
  info: "bg-info text-info-fg border-transparent",
} as const;

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: keyof typeof tones;
};

export function Badge({
  className,
  tone = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill border px-2 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
