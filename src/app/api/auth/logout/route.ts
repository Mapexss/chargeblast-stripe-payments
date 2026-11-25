import { destroySession } from "@/features/auth/session";
import { apiError, assertSameOrigin } from "@/lib/http";

export async function POST(request: Request) {
  const originError = assertSameOrigin(request);
  if (originError) return originError;
  try {
    await destroySession();
    return Response.json({ ok: true });
  } catch {
    return apiError(500, "api_error", "logout_failed", "Could not log out");
  }
}
