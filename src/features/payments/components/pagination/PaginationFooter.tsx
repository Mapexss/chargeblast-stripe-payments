"use client";

import { Button } from "@/components/ui/Button";
import { PageSizeSelect } from "@/features/payments/components/pagination/PageSizeSelect";

function pageWindow(current: number, total: number) {
  const pages = new Set<number>([1, total, current - 1, current, current + 1]);
  return [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);
}

export function PaginationFooter({
  page,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
}: {
  page: number;
  pageSize: 25 | 50 | 100;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: 25 | 50 | 100) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const start = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalCount);
  const pages = pageWindow(page, totalPages);

  return (
    <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-text-muted">
        Viewing {start}–{end} of {totalCount} results
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <PageSizeSelect
          value={pageSize}
          onChange={(size) => {
            onPageSizeChange(size);
          }}
        />
        <Button
          variant="secondary"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        {pages.map((item, index) => {
          const prev = pages[index - 1];
          const gap = prev !== undefined && item - prev > 1;
          return (
            <span key={item} className="contents">
              {gap ? <span className="px-1 text-text-muted">…</span> : null}
              <Button
                variant={item === page ? "primary" : "secondary"}
                size="sm"
                className="min-w-10 px-2"
                onClick={() => onPageChange(item)}
              >
                {item}
              </Button>
            </span>
          );
        })}
        <Button
          variant="secondary"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
