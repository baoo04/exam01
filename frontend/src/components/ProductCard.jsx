import { formatVnd } from "../utils/formatVnd";

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='200'%3E%3Crect fill='%23e2e8f0' width='320' height='200'/%3E%3C/svg%3E";

export function ProductCard({ product, footer }) {
  const low = product.stock <= 3;
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <img
          src={product.image_url || PLACEHOLDER}
          alt={product.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-semibold text-slate-900 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-slate-500">{product.brand}</p>
        <p className="text-lg font-bold text-sky-700">
          {formatVnd(product.price)}
        </p>
        <span
          className={`inline-flex w-fit rounded-full px-2 py-0.5 text-xs font-medium ${
            low
              ? "bg-amber-100 text-amber-900"
              : "bg-emerald-50 text-emerald-800"
          }`}
        >
          Còn {product.stock}
        </span>
        {footer ? <div className="mt-3 border-t border-slate-100 pt-3">{footer}</div> : null}
      </div>
    </article>
  );
}
