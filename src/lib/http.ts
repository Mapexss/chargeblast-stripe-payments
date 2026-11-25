import { NextResponse } from "next/server";

export type ErrorType =
  | "invalid_request_error"
  | "authentication_error"
  | "api_error";

export function apiError(
  status: number,
  type: ErrorType,
  code: string,
  message: string,
  param?: string,
) {
  return NextResponse.json(
    { error: { type, code, message, ...(param ? { param } : {}) } },
    { status },
  );
}

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return apiError(403, "invalid_request_error", "origin_required", "Origin header required");
  const expected = new URL(request.url).origin;
  if (origin !== expected) {
    return apiError(403, "invalid_request_error", "origin_mismatch", "Origin mismatch");
  }
  return null;
}
