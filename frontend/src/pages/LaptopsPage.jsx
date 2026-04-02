import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import * as laptopApi from "../api/laptopApi";
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

export default function LaptopsPage() {
  const { isCustomer, customer } = useAuth();
  const [cartMsg, setCartMsg] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const onSearch = useCallback((q) => setQuery(q), []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = query.trim()
          ? await laptopApi.search(query.trim(), { limit: 100 })
          : await laptopApi.getAll({ limit: 100 });
        if (!cancelled) setItems(unwrap(data));
      } catch (e) {
        if (!cancelled)
          setError(
            e?.response?.data?.detail ||
              e.message ||
              "Không kết nối được laptop service."
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

  async function handleAddToCart(p) {
    if (!customer?.id) return;
    setCartMsg("");
    try {
      await addProductToCart(customer.id, p, "laptop", 1);
      setCartMsg(`Đã thêm "${p.name}" vào giỏ.`);
    } catch (e) {
      setCartMsg(e?.response?.data?.detail || e.message || "Không thêm được.");
    }
  }

  const filtered = useMemo(() => {
    const min = priceMin === "" ? null : Number(priceMin);
    const max = priceMax === "" ? null : Number(priceMax);
    return items.filter((p) => {
      const price = Number(p.price);
      if (min !== null && !Number.isNaN(min) && price < min) return false;
      if (max !== null && !Number.isNaN(max) && price > max) return false;
      return true;
    });
  }, [items, priceMin, priceMax]);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Laptop</h1>
          <p className="text-sm text-slate-500">
            Sản phẩm từ dịch vụ cổng 8001 — đăng nhập khách để thêm vào giỏ.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBar onSearch={onSearch} placeholder="Tìm tên, CPU, thương hiệu…" />
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <label className="flex items-center gap-1 text-slate-600">
              Giá từ
              <input
                type="number"
                min={0}
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                className="w-28 rounded border border-slate-300 px-2 py-1"
                placeholder="₫"
              />
            </label>
            <label className="flex items-center gap-1 text-slate-600">
              đến
              <input
                type="number"
                min={0}
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                className="w-28 rounded border border-slate-300 px-2 py-1"
                placeholder="₫"
              />
            </label>
          </div>
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
          để thêm laptop vào giỏ.
        </p>
      ) : null}

      {loading ? <PageSkeleton /> : null}

      {!loading && !error ? (
        <>
          <p className="text-sm text-slate-600">{filtered.length} sản phẩm</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                footer={
                  isCustomer ? (
                    <button
                      type="button"
                      disabled={p.stock < 1}
                      onClick={() => handleAddToCart(p)}
                      className="w-full rounded-lg bg-sky-600 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
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
