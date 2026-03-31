import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import * as clothesApi from "../api/clothesApi";
import { ErrorMessage } from "../components/ErrorMessage";
import { ProductCard } from "../components/ProductCard";
import { SearchBar } from "../components/SearchBar";
import { useAuth } from "../context/AuthContext";
import { addProductToCart } from "../utils/cartActions";

function unwrap(data) {
  return data?.results ?? data ?? [];
}

function PageSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-72 animate-pulse rounded-xl bg-slate-200/80"
        />
      ))}
    </div>
  );
}

/** Hiển thị thêm meta quần áo dưới giá */
function ClothesCard({ product, footer }) {
  const low = product.stock <= 3;
  const PLACEHOLDER =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='200'%3E%3Crect fill='%23e2e8f0' width='320' height='200'/%3E%3C/svg%3E";
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
        <p className="text-xs text-slate-600">
          {product.category} · {product.gender} · Size {product.size} ·{" "}
          {product.color}
        </p>
        <p className="text-lg font-bold text-rose-700">
          {new Intl.NumberFormat("vi-VN").format(Number(product.price))} ₫
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
        {footer ? (
          <div className="mt-3 border-t border-slate-100 pt-3">{footer}</div>
        ) : null}
      </div>
    </article>
  );
}

export default function ClothesPage() {
  const { isCustomer, customer } = useAuth();
  const [cartMsg, setCartMsg] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [gender, setGender] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const onSearch = useCallback((q) => setQuery(q), []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = query.trim()
          ? await clothesApi.search(query.trim(), { limit: 100 })
          : await clothesApi.getAll({ limit: 100 });
        if (!cancelled) setItems(unwrap(data));
      } catch (e) {
        if (!cancelled)
          setError(
            e?.response?.data?.detail ||
              e.message ||
              "Không tải được quần áo qua API Gateway."
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [query, refreshKey]);

  const categories = useMemo(() => {
    const s = new Set(items.map((m) => m.category).filter(Boolean));
    return [...s].sort();
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((p) => {
      if (category && p.category !== category) return false;
      if (gender && p.gender !== gender) return false;
      return true;
    });
  }, [items, category, gender]);

  async function handleAddToCart(p) {
    if (!customer?.id) return;
    setCartMsg("");
    try {
      await addProductToCart(customer.id, p, "clothes", 1);
      setCartMsg(`Đã thêm "${p.name}" vào giỏ.`);
    } catch (e) {
      setCartMsg(e?.response?.data?.detail || e.message || "Không thêm được.");
    }
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quần áo</h1>
          <p className="text-sm text-slate-500">
            Thời trang · dữ liệu qua API Gateway — đăng nhập khách để thêm giỏ.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <SearchBar onSearch={onSearch} placeholder="Tìm tên, thương hiệu, màu…" />
          <label className="flex items-center gap-2 text-sm text-slate-600">
            Danh mục
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option value="">Tất cả</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            Giới tính
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option value="">Tất cả</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Unisex">Unisex</option>
            </select>
          </label>
        </div>
      </header>

      {error ? (
        <ErrorMessage
          message={error}
          onRetry={() => setRefreshKey((k) => k + 1)}
        />
      ) : null}

      {cartMsg ? (
        <p className="rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-900">
          {cartMsg}{" "}
          <Link to="/cart" className="font-medium underline">
            Xem giỏ
          </Link>
        </p>
      ) : null}
      {!isCustomer ? (
        <p className="text-sm text-amber-800">
          <Link to="/login" className="font-medium text-sky-700 underline">
            Đăng nhập khách hàng
          </Link>{" "}
          để thêm quần áo vào giỏ.
        </p>
      ) : null}

      {loading ? <PageSkeleton /> : null}

      {!loading && !error ? (
        <>
          <p className="text-sm text-slate-600">{filtered.length} sản phẩm</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <ClothesCard
                key={p.id}
                product={p}
                footer={
                  isCustomer ? (
                    <button
                      type="button"
                      disabled={p.stock < 1}
                      onClick={() => handleAddToCart(p)}
                      className="w-full rounded-lg bg-rose-600 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {p.stock < 1 ? "Hết hàng" : "Thêm vào giỏ"}
                    </button>
                  ) : null
                }
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
