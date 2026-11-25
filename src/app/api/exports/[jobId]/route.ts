import { NextResponse } from "next/server";
import { paymentFiltersSchema } from "@/features/payments/schema";
import {
  claimExportJob,
  completeExportJob,
  failExportJob,
  getExportJob,
  writeExportCsv,
} from "@/features/exports/queries";
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

  const elapsed = Date.now() - job.createdAt;
  const progress = Math.min(100, Math.floor((elapsed / 3000) * 100));

  if (elapsed >= 3000 && job.status === "queued") {
    const claimed = claimExportJob(jobId);
    if (claimed) {
      try {
        const filters = paymentFiltersSchema.parse(JSON.parse(job.filtersJson));
        const filePath = writeExportCsv(
          jobId,
          filters,
          job.scope as "view" | "all",
        );
        completeExportJob(jobId, filePath);
      } catch (error) {
        failExportJob(
          jobId,
          error instanceof Error ? error.message : "export failed",
        );
      }
    }
  }

  const latest = getExportJob(jobId)!;
  return Response.json({
    id: latest.id,
    object: "export_job",
    status: latest.status,
    progress: latest.status === "completed" ? 100 : progress,
    download_url:
      latest.status === "completed"
        ? `/api/exports/${latest.id}/download`
        : null,
    error_message: latest.errorMessage ?? null,
  });
}
