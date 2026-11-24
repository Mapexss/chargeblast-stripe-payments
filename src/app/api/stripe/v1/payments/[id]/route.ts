import { requireSession, UnauthorizedError } from "@/features/auth/session";
import { serializePayment } from "@/features/payments/api";
import { getPaymentById, listPaymentEvents } from "@/features/payments/queries";
import { apiError } from "@/lib/http";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await requireSession();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return apiError(
        401,
        "authentication_error",
        "unauthorized",
        "Authentication required",
      );
    }
    return apiError(500, "api_error", "internal_error", "Unexpected error");
  }

  const { id } = await context.params;
  const payment = getPaymentById(id);
  if (!payment) {
    return apiError(404, "invalid_request_error", "resource_missing", "No such payment", "id");
  }

  const events = listPaymentEvents(id).map((event) => ({
    id: event.id,
    object: "event" as const,
    type: event.type,
    created: event.createdAt,
    message: event.message,
  }));

  return Response.json({
    ...serializePayment(payment),
    events,
    metadata: JSON.parse(payment.metadata || "{}") as Record<string, string>,
    fee: payment.feeMinor,
    net: payment.netMinor,
    risk_score: payment.riskScore ?? null,
    decline_code: payment.declineCode ?? null,
    balance_transaction: payment.balanceTransactionId ?? null,
    payment_intent: payment.paymentIntentId ?? null,
    receipt_email: payment.receiptEmail ?? null,
  });
}
