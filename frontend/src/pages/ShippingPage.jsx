import { useCallback, useEffect, useState } from "react";
import * as shippingApi from "../api/shippingApi";
import { DataTable } from "../components/DataTable";
import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { StatusBadge } from "../components/StatusBadge";
import { formatVnd } from "../utils/formatVnd";

function unwrap(data) {
  return data?.results ?? data ?? [];
}

const CARRIER_CLASS = {
  GHN: "bg-orange-100 text-orange-900 ring-orange-200",
  GHTK: "bg-lime-100 text-lime-900 ring-lime-200",
  ViettelPost: "bg-red-100 text-red-900 ring-red-200",
  "JT Express": "bg-yellow-100 text-yellow-900 ring-yellow-200",
};

function CarrierBadge({ carrier }) {
  const cls =
    CARRIER_CLASS[carrier] || "bg-slate-100 text-slate-800 ring-slate-200";
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${cls}`}
    >
      {carrier}
    </span>
  );
}

export default function ShippingPage() {
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
          ? await shippingApi.search(q.trim(), { limit: 100 })
          : await shippingApi.getAll({ limit: 100 });
        if (!cancelled) setRows(unwrap(data));
      } catch (e) {
        if (!cancelled)
          setError(
            e?.response?.data?.detail ||
              e.message ||
              "Không kết nối được shipping service."
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
      key: "tracking_code",
      header: "Mã vận đơn",
      render: (r) => (
        <span className="font-mono text-sm font-semibold text-sky-800">
          {r.tracking_code}
        </span>
      ),
    },
    {
      key: "order_id",
      header: "Đơn hàng (UUID)",
      render: (r) => (
        <span className="font-mono text-xs text-slate-600">
          {String(r.order_id).slice(0, 8)}…
        </span>
      ),
    },
    {
      key: "carrier",
      header: "Đơn vị",
      render: (r) => <CarrierBadge carrier={r.carrier} />,
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (r) => <StatusBadge label={r.status} variant="shipping" />,
    },
    {
      key: "shipping_fee",
      header: "Phí",
      render: (r) => formatVnd(r.shipping_fee),
    },
    {
      key: "to_address",
      header: "Đến",
      render: (r) => (
        <span className="line-clamp-2 text-xs text-slate-700">
          {r.to_address}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Vận chuyển</h1>
        <p className="text-sm text-slate-500">Dịch vụ cổng 8007</p>
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
          searchPlaceholder="Mã vận đơn, trạng thái, địa chỉ…"
        />
      ) : null}
    </div>
  );
}
