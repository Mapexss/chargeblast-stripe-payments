import {
  CreditCard,
  Package,
  Users,
  Wallet,
} from "lucide-react";

export const navItems = [
  { href: "/payments", label: "Payments", icon: CreditCard },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/balances", label: "Balances", icon: Wallet },
  { href: "/products", label: "Products", icon: Package },
] as const;
