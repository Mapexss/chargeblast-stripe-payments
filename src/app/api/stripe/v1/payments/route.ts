import { requireSession, UnauthorizedError } from "@/features/auth/session";
import { listEnvelope, serializePayment } from "@/features/payments/api";
import { countPayments, listPayments } from "@/features/payments/queries";
import {
  coerceSearchParams,
  paymentFiltersSchema,
} from "@/features/payments/schema";
import { serializeFilters } from "@/features/payments/filters";
import { apiError } from "@/lib/http";

export async function GET(request: Request) {
  try {
    await requireSession();
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

  const url = new URL(request.url);
  let coerced: Record<string, unknown>;
  try {
    coerced = coerceSearchParams(url.searchParams);
  } catch (error) {
    const err = error as { param?: string; code?: string; message?: string };
    return apiError(
      400,
      "invalid_request_error",
      err.code ?? "invalid_request",
      err.message ?? "Invalid request",
      err.param ?? "page",
    );
  }

  const parsed = paymentFiltersSchema.safeParse(coerced);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const param = issue?.path?.[0] ? String(issue.path[0]) : undefined;
    return apiError(
      400,
      "invalid_request_error",
      "invalid_param",
      issue?.message ?? "Invalid parameter",
      param,
    );
  }

  const filters = parsed.data;
  const data = listPayments(filters).map(serializePayment);
  const totalCount = countPayments(filters);
  const query = serializeFilters(filters).toString();
  const path = `/api/stripe/v1/payments${query ? `?${query}` : ""}`;

  return Response.json(
    listEnvelope({
      data,
      totalCount,
      page: filters.page,
      pageSize: filters.page_size,
      url: path,
    }),
  );
}
