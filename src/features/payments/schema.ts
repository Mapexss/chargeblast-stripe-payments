import { z } from "zod";

export const paymentStatusSchema = z.enum([
  "succeeded",
  "pending",
  "failed",
  "refunded",
]);

export const paymentMethodSchema = z.enum(["card", "ach", "wallet"]);

export const currencySchema = z.enum(["usd", "eur", "brl", "gbp"]);

export const sortFieldSchema = z.enum(["created", "amount", "status"]);
export const sortDirectionSchema = z.enum(["asc", "desc"]);

export const amountOpSchema = z.enum(["eq", "gt", "lt", "between"]);

export const rangeSchema = z.enum(["today", "7d", "30d", "custom"]);

const intString = z
  .string()
  .regex(/^-?\d+$/)
  .transform((value) => Number(value));

export const paymentFiltersSchema = z
  .object({
    q: z.string().max(200).optional(),
    status: z.array(paymentStatusSchema).optional(),
    method: z.array(paymentMethodSchema).optional(),
    currency: currencySchema.optional(),
    range: rangeSchema.optional(),
    from: z.number().int().optional(),
    to: z.number().int().optional(),
    amount_op: amountOpSchema.optional(),
    amount_value: z.number().int().optional(),
    amount_min: z.number().int().optional(),
    amount_max: z.number().int().optional(),
    sort: sortFieldSchema.default("created"),
    direction: sortDirectionSchema.default("desc"),
    page: z.number().int().min(1).default(1),
    page_size: z.union([z.literal(25), z.literal(50), z.literal(100)]).default(25),
  })
  .superRefine((value, ctx) => {
    const hasAmount =
      value.amount_op !== undefined ||
      value.amount_value !== undefined ||
      value.amount_min !== undefined ||
      value.amount_max !== undefined;
    if (hasAmount && !value.currency) {
      ctx.addIssue({
        code: "custom",
        message: "currency is required when filtering by amount",
        path: ["amount"],
      });
    }
    if (value.amount_op === "between") {
      if (value.amount_min === undefined || value.amount_max === undefined) {
        ctx.addIssue({
          code: "custom",
          message: "amount_min and amount_max are required for between",
          path: ["amount"],
        });
      }
    } else if (value.amount_op && value.amount_value === undefined) {
      ctx.addIssue({
        code: "custom",
        message: "amount_value is required",
        path: ["amount"],
      });
    }
  });

export type PaymentFilters = z.infer<typeof paymentFiltersSchema>;

export function coerceSearchParams(
  raw: URLSearchParams,
): Record<string, unknown> {
  if (raw.has("starting_after") || raw.has("ending_before")) {
    throw Object.assign(new Error("cursor pagination is not supported"), {
      param: "page",
      code: "offset_required",
    });
  }

  const out: Record<string, unknown> = {};
  const q = raw.get("q");
  if (q) out.q = q;

  const status = raw.get("status");
  if (status) out.status = status.split(",").filter(Boolean);

  const method = raw.get("method");
  if (method) out.method = method.split(",").filter(Boolean);

  const currency = raw.get("currency");
  if (currency) out.currency = currency;

  const range = raw.get("range");
  if (range) out.range = range;

  for (const key of ["from", "to", "amount_value", "amount_min", "amount_max", "page", "page_size"] as const) {
    const value = raw.get(key);
    if (value === null) continue;
    const parsed = intString.safeParse(value);
    if (!parsed.success) {
      throw Object.assign(new Error(`Invalid ${key}`), { param: key, code: "invalid_integer" });
    }
    out[key] = parsed.data;
  }

  const amountOp = raw.get("amount_op");
  if (amountOp) out.amount_op = amountOp;

  const sort = raw.get("sort");
  if (sort) out.sort = sort;

  const direction = raw.get("direction");
  if (direction) out.direction = direction;

  return out;
}
