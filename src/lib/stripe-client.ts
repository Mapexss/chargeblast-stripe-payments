export class StripeClientError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown) {
    super(`Stripe client error ${status}`);
    this.status = status;
    this.body = body;
  }
}

export async function stripeFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      accept: "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const body = await response.json();
  if (!response.ok) throw new StripeClientError(response.status, body);
  return body as T;
}
