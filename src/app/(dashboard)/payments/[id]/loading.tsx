import { Skeleton } from "@/components/ui/Skeleton";

export default function PaymentDetailsLoading() {
  return (
    <div className="space-y-3 p-6">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}
