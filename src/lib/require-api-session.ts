import { requireSession, UnauthorizedError } from "@/features/auth/session";
import { apiError } from "@/lib/http";

export async function requireApiSession() {
  try {
    return await requireSession();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return apiError(
        401,
        "authentication_error",
        "unauthorized",
        "Authentication required",
      );
    }
    return apiError(500, "api_error", "internal_error", "Unexpected error");
  }
}
