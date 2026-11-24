import { requireSession, UnauthorizedError } from "@/features/auth/session";
import { apiError } from "@/lib/http";

export async function GET() {
  try {
    await requireSession();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return apiError(401, "authentication_error", "unauthorized", "Authentication required");
    }
    return apiError(500, "api_error", "internal_error", "Unexpected error");
  }
  return Response.json({
    object: "list",
    data: [],
    has_more: false,
    total_count: 0,
    page: 1,
    page_size: 25,
    url: "/api/stripe/v1/payments?page=1",
  });
}
