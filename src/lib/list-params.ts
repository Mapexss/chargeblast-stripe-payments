import { z } from "zod";

export const listParamsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  page_size: z.coerce
    .number()
    .int()
    .refine((value) => value === 25 || value === 50 || value === 100)
    .default(25),
});

export function parseListParams(searchParams: URLSearchParams) {
  return listParamsSchema.safeParse({
    page: searchParams.get("page") ?? undefined,
    page_size: searchParams.get("page_size") ?? undefined,
  });
}
