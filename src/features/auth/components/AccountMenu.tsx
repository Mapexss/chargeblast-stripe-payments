"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { DropdownMenu } from "@/components/ui/DropdownMenu";

export function AccountMenu({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <DropdownMenu
      trigger={
        <Button variant="secondary" aria-label="Account menu">
          {name}
        </Button>
      }
      items={[
        { key: "email", label: email, disabled: true },
        { key: "logout", label: "Log out", onSelect: () => void logout(), danger: true },
      ]}
    />
  );
}
