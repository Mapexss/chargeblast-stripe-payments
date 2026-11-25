import { NextResponse } from "next/server";
import { createExportJob } from "@/features/exports/queries";
import { exportRequestSchema } from "@/features/exports/schema";
import { apiError, assertSameOrigin } from "@/lib/http";
import { requireApiSession } from "@/lib/require-api-session";

export async function POST(request: Request) {
  const originError = assertSameOrigin(request);
  if (originError) return originError;

  const session = await requireApiSession();
  if (session instanceof NextResponse) return session;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return apiError(400, "invalid_request_error", "invalid_json", "Invalid JSON body");
  }

  const parsed = exportRequestSchema.safeParse(json);
  if (!parsed.success) {
    return apiError(
      400,
      "invalid_request_error",
      "invalid_param",
      parsed.error.issues[0]?.message ?? "Invalid export payload",
      String(parsed.error.issues[0]?.path[0] ?? "filters"),
    );
  }

  const job = createExportJob(parsed.data);
  return Response.json({
    id: job.id,
    object: "export_job",
    status: "queued",
    progress: 0,
  });
}
