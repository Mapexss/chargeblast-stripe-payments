"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AccountMenu } from "@/features/auth/components/AccountMenu";
import { Input } from "@/components/ui/Input";
import { MobileNav } from "@/components/layout/MobileNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export function TopBar({
  name,
  email,
  theme,
}: {
  name: string;
  email: string;
  theme: "light" | "dark";
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }
      event.preventDefault();
      inputRef.current?.focus();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-bg px-3 md:px-4">
      <MobileNav />
      <form
        className="relative min-w-0 flex-1"
        onSubmit={(event) => {
          event.preventDefault();
          const value = new FormData(event.currentTarget).get("q");
          const q = typeof value === "string" ? value.trim() : "";
          router.push(q ? `/payments?q=${encodeURIComponent(q)}` : "/payments");
        }}
      >
        <Input
          ref={inputRef}
          name="q"
          placeholder="Search payments"
          aria-label="Search payments"
          className="pr-12"
        />
        <kbd className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 rounded border border-border px-1.5 text-[10px] text-text-muted sm:inline">
          /
        </kbd>
      </form>
      <ThemeToggle theme={theme} />
      <AccountMenu name={name} email={email} />
    </header>
  );
}
