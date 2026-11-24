import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AccountMenu } from "@/features/auth/components/AccountMenu";
import { requireSession, UnauthorizedError } from "@/features/auth/session";

async function DashboardGate({ children }: { children: React.ReactNode }) {
  let user: Awaited<ReturnType<typeof requireSession>>;
  try {
    user = await requireSession();
  } catch (error) {
    if (error instanceof UnauthorizedError) redirect("/login");
    throw error;
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="flex h-14 items-center justify-end border-b border-border bg-bg px-4">
        <AccountMenu name={user.name} email={user.email} />
      </header>
      <div className="flex-1">{children}</div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={null}>
      <DashboardGate>{children}</DashboardGate>
    </Suspense>
  );
}
