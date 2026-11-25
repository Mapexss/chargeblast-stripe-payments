import { readFileSync } from "node:fs";
import { NextResponse } from "next/server";
import { getExportJob, resolveExportPath } from "@/features/exports/queries";
import { apiError } from "@/lib/http";
import { requireApiSession } from "@/lib/require-api-session";

export async function GET(
  _request: Request,
  context: { params: Promise<{ jobId: string }> },
) {
  const session = await requireApiSession();
  if (session instanceof NextResponse) return session;

  const { jobId } = await context.params;
  const job = getExportJob(jobId);
  if (!job) {
    return apiError(404, "invalid_request_error", "resource_missing", "No such export", "jobId");
  }
  if (job.status !== "completed" || !job.filePath) {
    return apiError(409, "invalid_request_error", "export_not_ready", "Export is not ready");
  }

  try {
    const fullPath = resolveExportPath(job.filePath);
    const body = readFileSync(fullPath);
    return new Response(body, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${jobId}.csv"`,
      },
    });
  } catch {
    return apiError(404, "invalid_request_error", "resource_missing", "Export file missing");
  }
}
