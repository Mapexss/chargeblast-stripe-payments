import { listEnvelope, serializeProduct } from "@/features/payments/api";
import { countProducts, listProducts } from "@/features/products/queries";
import { parseListParams } from "@/lib/list-params";
import { apiError } from "@/lib/http";
import { requireApiSession } from "@/lib/require-api-session";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await requireApiSession();
  if (session instanceof NextResponse) return session;

  const url = new URL(request.url);
  const parsed = parseListParams(url.searchParams);
  if (!parsed.success) {
    return apiError(
      400,
      "invalid_request_error",
      "invalid_param",
      parsed.error.issues[0]?.message ?? "Invalid parameter",
      String(parsed.error.issues[0]?.path[0] ?? "page"),
    );
  }

  const { page, page_size } = parsed.data;
  const data = listProducts(page, page_size).map(serializeProduct);
  const totalCount = countProducts();
  const query = url.searchParams.toString();
  return Response.json(
    listEnvelope({
      data,
      totalCount,
      page,
      pageSize: page_size,
      url: `/api/stripe/v1/products${query ? `?${query}` : ""}`,
    }),
  );
}
