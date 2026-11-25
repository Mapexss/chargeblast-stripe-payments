import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { requireSession, UnauthorizedError } from "@/features/auth/session";
import { parseTheme } from "@/lib/theme";

async function DashboardGate({ children }: { children: React.ReactNode }) {
  let user: Awaited<ReturnType<typeof requireSession>>;
  try {
    user = await requireSession();
  } catch (error) {
    if (error instanceof UnauthorizedError) redirect("/login");
    throw error;
  }

  const jar = await cookies();
  const theme = parseTheme(jar.get("theme")?.value);

  return (
    <div className="flex min-h-full flex-1">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar name={user.name} email={user.email} theme={theme} />
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
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
