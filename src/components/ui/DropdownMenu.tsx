"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type DropdownMenuItem = {
  key: string;
  label: string;
  onSelect?: () => void;
  disabled?: boolean;
  danger?: boolean;
};

export type DropdownMenuProps = {
  trigger: ReactNode;
  items: DropdownMenuItem[];
  align?: "start" | "center" | "end";
  className?: string;
};

export function DropdownMenu({
  trigger,
  items,
  align = "end",
  className,
}: DropdownMenuProps) {
  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>{trigger}</DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align={align}
          sideOffset={6}
          className={cn(
            "z-50 min-w-44 overflow-hidden rounded-[var(--radius-control)] border border-border bg-bg p-1 shadow-md",
            className,
          )}
        >
          {items.map((item) => (
            <DropdownMenuPrimitive.Item
              key={item.key}
              disabled={item.disabled}
              onSelect={item.onSelect}
              className={cn(
                "flex h-10 min-h-10 cursor-pointer items-center rounded-[var(--radius-pill)] px-2 text-sm outline-none data-[highlighted]:bg-surface data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                item.danger ? "text-danger-fg" : "text-text",
              )}
            >
              {item.label}
            </DropdownMenuPrimitive.Item>
          ))}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}
