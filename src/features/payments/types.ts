export type PaymentWire = {
  id: string;
  object: "payment";
  amount: number;
  currency: string;
  status: string;
  description: string;
  created: number;
  customer: { id: string; name: string; email: string };
  payment_method: {
    type: string;
    brand: string | null;
    last4: string | null;
    funding: string | null;
    exp_month: number | null;
    exp_year: number | null;
    cvc_check: string | null;
    wallet: string | null;
  };
  refunded_amount: number | null;
  failure_code: string | null;
  failure_message: string | null;
};

export type PaymentsListResponse = {
  object: "list";
  data: PaymentWire[];
  has_more: boolean;
  total_count: number;
  page: number;
  page_size: number;
  url: string;
};
