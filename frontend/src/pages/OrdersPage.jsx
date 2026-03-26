import { useCallback, useEffect, useState } from "react";
import * as orderApi from "../api/orderApi";
import { DataTable } from "../components/DataTable";
import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingSpinner } from "../components/LoadingSpinner";
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
              "Không kết nối được order service."
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

  const columns = [
    {
      key: "id",
      header: "Mã đơn",
      render: (r) => (
        <span className="font-mono text-xs text-slate-600">
          {String(r.id).slice(0, 8)}…
        </span>
      ),
    },
    {
      key: "customer_id",
      header: "Khách (UUID)",
      render: (r) => (
        <span className="font-mono text-xs text-slate-600">
          {String(r.customer_id).slice(0, 8)}…
        </span>
      ),
    },
    {
      key: "total_amount",
      header: "Tổng",
      render: (r) => formatVnd(r.total_amount),
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (r) => <StatusBadge label={r.status} variant="order" />,
    },
    {
      key: "payment_method",
      header: "Thanh toán",
      render: (r) => (
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-800 ring-1 ring-slate-200">
          {r.payment_method}
        </span>
      ),
    },
    {
      key: "payment_status",
      header: "TT thanh toán",
      render: (r) => <StatusBadge label={r.payment_status} variant="payment" />,
    },
    {
      key: "items",
      header: "Sản phẩm",
      render: (r) => (
        <ul className="max-w-xs space-y-1 text-xs text-slate-700">
          {(r.items || []).map((it) => (
            <li key={it.id}>
              <span className="font-medium">{it.product_name}</span>
              <span className="text-slate-500">
                {" "}
                ×{it.quantity} · {it.product_type}
              </span>
            </li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Đơn hàng</h1>
        <p className="text-sm text-slate-500">Dịch vụ cổng 8005</p>
      </header>
      {error ? (
        <ErrorMessage
          message={error}
          onRetry={() => setRefreshKey((k) => k + 1)}
        />
      ) : null}
      {loading ? <LoadingSpinner /> : null}
      {!loading && !error ? (
        <DataTable
          columns={columns}
          data={rows}
          onSearch={onSearch}
          searchPlaceholder="Địa chỉ, trạng thái, phương thức…"
        />
      ) : null}
    </div>
  );
}
