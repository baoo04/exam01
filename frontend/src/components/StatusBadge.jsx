const ORDER_STATUS = {
  pending: "bg-amber-100 text-amber-900 ring-amber-200",
  confirmed: "bg-sky-100 text-sky-900 ring-sky-200",
  shipping: "bg-blue-100 text-blue-900 ring-blue-200",
  delivered: "bg-emerald-100 text-emerald-900 ring-emerald-200",
  cancelled: "bg-red-100 text-red-900 ring-red-200",
};

const SHIPPING_STATUS = {
  preparing: "bg-amber-100 text-amber-900 ring-amber-200",
  picked_up: "bg-sky-100 text-sky-900 ring-sky-200",
  in_transit: "bg-blue-100 text-blue-900 ring-blue-200",
  delivered: "bg-emerald-100 text-emerald-900 ring-emerald-200",
  failed: "bg-red-100 text-red-900 ring-red-200",
};

const PAYMENT_STATUS = {
  unpaid: "bg-amber-100 text-amber-900 ring-amber-200",
  paid: "bg-emerald-100 text-emerald-900 ring-emerald-200",
  refunded: "bg-red-100 text-red-900 ring-red-200",
};

export function StatusBadge({ label, variant = "order" }) {
  const key = String(label || "")
    .toLowerCase()
    .replace(/\s+/g, "_");
  let map = ORDER_STATUS;
  if (variant === "shipping") map = SHIPPING_STATUS;
  if (variant === "payment") map = PAYMENT_STATUS;
  const cls =
    map[key] || "bg-slate-100 text-slate-800 ring-slate-200";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${cls}`}
    >
      {label}
    </span>
  );
}
