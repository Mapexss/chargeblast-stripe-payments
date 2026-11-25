import {
  amountOpSchema,
  currencySchema,
  paymentFiltersSchema,
  paymentMethodSchema,
  paymentStatusSchema,
  rangeSchema,
  sortDirectionSchema,
  sortFieldSchema,
  type PaymentFilters,
} from "./schema";

function splitList(value: string | null): string[] {
  if (!value) return [];
  return value.split(",").map((part) => part.trim()).filter(Boolean);
}

function parseIntParam(value: string | null): number | undefined {
  if (value === null || value === "") return undefined;
  if (!/^-?\d+$/.test(value)) return undefined;
  return Number(value);
}

export function parseFilters(
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>,
): PaymentFilters {
  const raw =
    searchParams instanceof URLSearchParams
      ? searchParams
      : new URLSearchParams(
          Object.entries(searchParams).flatMap(([key, value]) => {
            if (value === undefined) return [];
            if (Array.isArray(value)) return value.map((item) => [key, item] as [string, string]);
            return [[key, value] as [string, string]];
          }),
        );

  let from = parseIntParam(raw.get("from"));
  let to = parseIntParam(raw.get("to"));
  if (from !== undefined && to !== undefined && from > to) {
    const swap = from;
    from = to;
    to = swap;
  }

  const page = parseIntParam(raw.get("page"));
  const pageSize = parseIntParam(raw.get("page_size"));

  const draft = {
    q: raw.get("q")?.slice(0, 200) || undefined,
    status: splitList(raw.get("status"))
      .map((value) => paymentStatusSchema.safeParse(value))
      .filter((result) => result.success)
      .map((result) => result.data),
    method: splitList(raw.get("method"))
      .map((value) => paymentMethodSchema.safeParse(value))
      .filter((result) => result.success)
      .map((result) => result.data),
    currency: currencySchema.safeParse(raw.get("currency") ?? undefined).success
      ? currencySchema.parse(raw.get("currency"))
      : undefined,
    range: rangeSchema.safeParse(raw.get("range") ?? undefined).success
      ? rangeSchema.parse(raw.get("range"))
      : undefined,
    from,
    to,
    amount_op: amountOpSchema.safeParse(raw.get("amount_op") ?? undefined).success
      ? amountOpSchema.parse(raw.get("amount_op"))
      : undefined,
    amount_value: parseIntParam(raw.get("amount_value")),
    amount_min: parseIntParam(raw.get("amount_min")),
    amount_max: parseIntParam(raw.get("amount_max")),
    sort: sortFieldSchema.safeParse(raw.get("sort") ?? "created").success
      ? sortFieldSchema.parse(raw.get("sort") ?? "created")
      : "created",
    direction: sortDirectionSchema.safeParse(raw.get("direction") ?? "desc").success
      ? sortDirectionSchema.parse(raw.get("direction") ?? "desc")
      : "desc",
    page: page !== undefined && page >= 1 ? page : 1,
    page_size:
      pageSize === 25 || pageSize === 50 || pageSize === 100 ? pageSize : 25,
  };

  if (
    draft.amount_op ||
    draft.amount_value !== undefined ||
    draft.amount_min !== undefined ||
    draft.amount_max !== undefined
  ) {
    if (!draft.currency) {
      draft.amount_op = undefined;
      draft.amount_value = undefined;
      draft.amount_min = undefined;
      draft.amount_max = undefined;
    }
  }

  return paymentFiltersSchema.parse(draft);
}

export function serializeFilters(filters: PaymentFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.status?.length) params.set("status", filters.status.join(","));
  if (filters.method?.length) params.set("method", filters.method.join(","));
  if (filters.currency) params.set("currency", filters.currency);
  if (filters.range) params.set("range", filters.range);
  if (filters.from !== undefined) params.set("from", String(filters.from));
  if (filters.to !== undefined) params.set("to", String(filters.to));
  if (filters.amount_op) params.set("amount_op", filters.amount_op);
  if (filters.amount_value !== undefined) {
    params.set("amount_value", String(filters.amount_value));
  }
  if (filters.amount_min !== undefined) {
    params.set("amount_min", String(filters.amount_min));
  }
  if (filters.amount_max !== undefined) {
    params.set("amount_max", String(filters.amount_max));
  }
  if (filters.sort !== "created") params.set("sort", filters.sort);
  if (filters.direction !== "desc") params.set("direction", filters.direction);
  if (filters.page !== 1) params.set("page", String(filters.page));
  if (filters.page_size !== 25) params.set("page_size", String(filters.page_size));
  return params;
}
