import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const variants = {
  primary:
    "bg-accent text-white hover:opacity-90 focus-visible:ring-accent",
  secondary:
    "bg-surface text-text border border-border hover:bg-border/40 focus-visible:ring-accent",
  ghost:
    "bg-transparent text-text-muted hover:bg-surface hover:text-text focus-visible:ring-accent",
  danger:
    "bg-transparent text-danger-fg hover:bg-danger focus-visible:ring-danger-fg",
} as const;

const sizes = {
  sm: "h-10 min-h-10 px-3 text-sm",
  md: "h-10 min-h-10 px-4 text-sm",
  lg: "h-11 min-h-11 px-5 text-base",
} as const;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className, variant = "primary", size = "md", type = "button", ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-[var(--radius-control)] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      />
    );
  },
);
