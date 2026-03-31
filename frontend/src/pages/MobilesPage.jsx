import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import * as mobileApi from "../api/mobileApi";
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

export default function MobilesPage() {
  const { isCustomer, customer } = useAuth();
  const [cartMsg, setCartMsg] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const onSearch = useCallback((q) => setQuery(q), []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = query.trim()
          ? await mobileApi.search(query.trim(), { limit: 100 })
          : await mobileApi.getAll({ limit: 100 });
        if (!cancelled) setItems(unwrap(data));
      } catch (e) {
        if (!cancelled)
          setError(
            e?.response?.data?.detail ||
              e.message ||
              "Không tải được điện thoại qua API Gateway."
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

  const brands = useMemo(() => {
    const s = new Set(items.map((m) => m.brand).filter(Boolean));
    return [...s].sort();
  }, [items]);

  const filtered = useMemo(() => {
    if (!brand) return items;
    return items.filter(
      (m) => m.brand.toLowerCase() === brand.toLowerCase()
    );
  }, [items, brand]);

  async function handleAddToCart(p) {
    if (!customer?.id) return;
    setCartMsg("");
    try {
      await addProductToCart(customer.id, p, "mobile", 1);
      setCartMsg(`Đã thêm "${p.name}" vào giỏ.`);
    } catch (e) {
      setCartMsg(e?.response?.data?.detail || e.message || "Không thêm được.");
    }
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Điện thoại</h1>
          <p className="text-sm text-slate-500">
            Dữ liệu điện thoại qua API Gateway — đăng nhập khách để thêm vào giỏ.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBar onSearch={onSearch} placeholder="Tìm tên, OS, chip…" />
          <label className="flex items-center gap-2 text-sm text-slate-600">
            Thương hiệu
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option value="">Tất cả</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
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
          để thêm điện thoại vào giỏ.
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
                      className="w-full rounded-lg bg-violet-600 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
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
