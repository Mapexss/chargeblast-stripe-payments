const FORMULA_PREFIX = /^[=+\-@\t\r]/;

export function escapeCsvCell(value: string, delimiter = ",") {
  let cell = value;
  if (FORMULA_PREFIX.test(cell)) cell = `'${cell}`;
  if (
    cell.includes(delimiter) ||
    cell.includes('"') ||
    cell.includes("\n") ||
    cell.includes("\r")
  ) {
    cell = `"${cell.replaceAll('"', '""')}"`;
  }
  return cell;
}

export function buildPaymentsCsv(
  rows: Array<Record<string, string | number | null | undefined>>,
) {
  const columns = [
    "id",
    "created",
    "amount",
    "currency",
    "status",
    "description",
    "customer_name",
    "customer_email",
    "payment_method_type",
    "brand",
    "last4",
    "refunded_amount",
    "failure_code",
    "failure_message",
  ] as const;

  const lines = [columns.join(",")];
  for (const row of rows) {
    lines.push(
      columns
        .map((column) => escapeCsvCell(String(row[column] ?? "")))
        .join(","),
    );
  }
  return `${lines.join("\n")}\n`;
}
