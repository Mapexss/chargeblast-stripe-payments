import { NavItem } from "@/components/layout/NavItem";
import { navItems } from "@/components/layout/nav-items";

export function Sidebar() {
  return (
    <aside className="hidden h-full w-60 shrink-0 flex-col border-r border-border bg-surface lg:flex">
      <div className="flex h-14 items-center px-4">
        <span className="text-sm font-semibold tracking-tight text-text">
          Stripe
        </span>
      </div>
      <nav aria-label="Primary" className="flex flex-1 flex-col gap-1 px-2 pb-4">
        {navItems.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>
    </aside>
  );
}
