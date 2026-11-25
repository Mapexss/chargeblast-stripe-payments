"use client";

import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";

export function ExportScopeDialog({
  open,
  onOpenChange,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (scope: "view" | "all") => void;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Export CSV"
      description="Choose which rows to include in the export."
    >
      <div className="flex flex-col gap-2">
        <Button
          variant="secondary"
          onClick={() => {
            onSelect("view");
            onOpenChange(false);
          }}
        >
          Current view
        </Button>
        <Button
          onClick={() => {
            onSelect("all");
            onOpenChange(false);
          }}
        >
          All matching results
        </Button>
      </div>
    </Dialog>
  );
}
