"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ExportScopeDialog } from "@/features/exports/components/ExportScopeDialog";
import { useExportJob } from "@/features/exports/hooks/use-export-job";
import { usePaymentFilters } from "@/features/payments/hooks/use-payment-filters";

export function ExportWidget() {
  const { filters } = usePaymentFilters();
  const { job, error, start } = useExportJob();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Export
      </Button>
      <ExportScopeDialog
        open={open}
        onOpenChange={setOpen}
        onSelect={(scope) => void start(filters, scope)}
      />
      <AnimatePresence>
        {job ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed right-4 bottom-4 z-50 w-72 rounded-[var(--radius-control)] border border-border bg-bg p-4 shadow-lg"
          >
            <p className="text-sm font-medium text-text">Export {job.status}</p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface">
              <div
                className="h-full bg-accent transition-all"
                style={{ width: `${job.progress}%` }}
              />
            </div>
            {job.status === "completed" && job.download_url ? (
              <a
                href={job.download_url}
                className="mt-3 inline-flex h-10 items-center text-sm font-medium text-accent"
              >
                Download CSV
              </a>
            ) : null}
            {error || job.error_message ? (
              <p className="mt-2 text-sm text-danger-fg">{error ?? job.error_message}</p>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
