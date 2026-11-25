import { z } from "zod";
import { findUserByEmail } from "@/features/auth/queries";
import { checkLoginRateLimit } from "@/features/auth/rate-limit";
import { verifyPassword } from "@/features/auth/password";
import { safeNextPath } from "@/features/auth/safe-next";
import { createSession } from "@/features/auth/session";
import { apiError, assertSameOrigin } from "@/lib/http";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  next: z.string().optional(),
});

export async function POST(request: Request) {
  const originError = assertSameOrigin(request);
  if (originError) return originError;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return apiError(400, "invalid_request_error", "invalid_json", "Invalid JSON body");
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return apiError(400, "invalid_request_error", "invalid_params", "Invalid login payload");
  }

  const email = parsed.data.email.toLowerCase();
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (!checkLoginRateLimit(`${ip}:${email}`)) {
    return apiError(429, "invalid_request_error", "rate_limited", "Too many login attempts");
  }

  const user = findUserByEmail(email);
  const valid =
    user !== undefined && (await verifyPassword(parsed.data.password, user.passwordHash));
  if (!user || !valid) {
    return apiError(401, "authentication_error", "invalid_credentials", "Invalid email or password");
  }

  await createSession(user.id);
  return Response.json({ ok: true, next: safeNextPath(parsed.data.next) });
}
