"use client";

import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { NavItem } from "@/components/layout/NavItem";
import { navItems } from "@/components/layout/nav-items";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Navigation"
        trigger={
          <Button variant="ghost" size="sm" aria-label="Open navigation" className="px-2">
            <Menu className="size-4" />
          </Button>
        }
        className="top-0 left-0 h-full max-h-none w-[min(100%,20rem)] translate-x-0 translate-y-0 rounded-none"
      >
        <nav aria-label="Mobile" className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              onNavigate={() => setOpen(false)}
            />
          ))}
        </nav>
      </Dialog>
    </div>
  );
}
