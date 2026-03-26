export function formatVnd(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return "—";
  return `${new Intl.NumberFormat("vi-VN").format(num)} ₫`;
}
