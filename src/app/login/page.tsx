import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { safeNextPath } from "@/features/auth/safe-next";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to the Stripe payments dashboard replica.",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const nextPath = safeNextPath(params.next);

  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center gap-6 bg-surface px-4">
      <div className="w-full max-w-sm rounded-[var(--radius-control)] border border-border bg-bg p-6 shadow-sm">
        <h1 className="mb-1 text-xl font-semibold text-text">Sign in</h1>
        <p className="mb-6 text-sm text-text-muted">
          Use the seeded demo account to open Payments.
        </p>
        <LoginForm nextPath={nextPath} />
      </div>
    </main>
  );
}
