"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PaymentFilters } from "@/features/payments/schema";
import { stripeFetch } from "@/lib/stripe-client";

type JobResponse = {
  id: string;
  status: string;
  progress: number;
  download_url: string | null;
  error_message: string | null;
};

export function useExportJob() {
  const [job, setJob] = useState<JobResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const polls = useRef(0);

  const start = useCallback(async (filters: PaymentFilters, scope: "view" | "all") => {
    setError(null);
    polls.current = 0;
    const created = await stripeFetch<{ id: string }>("/api/exports", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ filters, scope }),
    });
    setJob({
      id: created.id,
      status: "queued",
      progress: 0,
      download_url: null,
      error_message: null,
    });
  }, []);

  useEffect(() => {
    if (!job || job.status === "completed" || job.status === "failed") return;

    const timer = window.setInterval(async () => {
      if (document.hidden) return;
      if (polls.current >= 60) {
        setError("Export timed out");
        window.clearInterval(timer);
        return;
      }
      polls.current += 1;
      try {
        const next = await stripeFetch<JobResponse>(`/api/exports/${job.id}`);
        setJob(next);
        if (next.status === "completed" || next.status === "failed") {
          window.clearInterval(timer);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Export failed");
        window.clearInterval(timer);
      }
    }, 700);

    return () => window.clearInterval(timer);
  }, [job]);

  return { job, error, start };
}
