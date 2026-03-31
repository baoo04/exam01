import { useCallback, useEffect, useState } from "react";
import * as orderApi from "../api/orderApi";
import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { SearchBar } from "../components/SearchBar";
import { StatusBadge } from "../components/StatusBadge";
import { formatVnd } from "../utils/formatVnd";

function unwrap(data) {
  return data?.results ?? data ?? [];
}

export default function OrdersPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [q, setQ] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const onSearch = useCallback((v) => setQ(v), []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = q.trim()
          ? await orderApi.search(q.trim(), { limit: 100 })
          : await orderApi.getAll({ limit: 100 });
        if (!cancelled) setRows(unwrap(data));
      } catch (e) {
        if (!cancelled)
          setError(
            e?.response?.data?.detail ||
              e.message ||
              "Không thể tải đơn hàng qua API Gateway."
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [q, refreshKey]);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">Đơn hàng</h1>
        <p className="text-sm text-slate-500">Theo dõi đơn hàng qua API Gateway</p>
      </header>
      <SearchBar
        onSearch={onSearch}
        placeholder="Địa chỉ, trạng thái, phương thức thanh toán..."
      />
      {error ? (
        <ErrorMessage
          message={error}
          onRetry={() => setRefreshKey((k) => k + 1)}
        />
      ) : null}
      {loading ? <LoadingSpinner /> : null}
      {!loading && !error && rows.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
          Không có đơn hàng phù hợp.
        </div>
      ) : null}
      {!loading && !error && rows.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {rows.map((r) => (
            <article
              key={r.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-xs text-slate-500">
                  Đơn #{String(r.id).slice(0, 8)}…
                </p>
                <StatusBadge label={r.status} variant="order" />
              </div>
              <p className="mt-1 text-sm text-slate-600">
                Khách:{" "}
                <span className="font-mono text-xs">
                  {String(r.customer_id).slice(0, 8)}…
                </span>
              </p>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-lg font-semibold text-slate-900">
                  {formatVnd(r.total_amount)}
                </p>
                <StatusBadge label={r.payment_status} variant="payment" />
              </div>
              <p className="mt-1 text-xs text-slate-500">{r.payment_method}</p>
              <div className="mt-3 space-y-2">
                {(r.items || []).map((it) => (
                  <div
                    key={it.id}
                    className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-700"
                  >
                    <span className="font-medium text-slate-900">
                      {it.product_name}
                    </span>{" "}
                    ×{it.quantity} · {it.product_type}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
}
