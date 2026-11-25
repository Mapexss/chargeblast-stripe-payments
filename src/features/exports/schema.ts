import { z } from "zod";
import { paymentFiltersSchema } from "@/features/payments/schema";

export const exportRequestSchema = z.object({
  scope: z.enum(["view", "all"]),
  filters: paymentFiltersSchema,
});

export type ExportRequest = z.infer<typeof exportRequestSchema>;
