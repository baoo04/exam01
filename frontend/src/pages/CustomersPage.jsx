import { useCallback, useEffect, useState } from "react";
import * as customerApi from "../api/customerApi";
import { DataTable } from "../components/DataTable";
import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingSpinner } from "../components/LoadingSpinner";

function unwrap(data) {
  return data?.results ?? data ?? [];
}

export default function CustomersPage() {
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
          ? await customerApi.search(q.trim(), { limit: 100 })
          : await customerApi.getAll({ limit: 100 });
        if (!cancelled) setRows(unwrap(data));
      } catch (e) {
        if (!cancelled)
          setError(
            e?.response?.data?.detail ||
              e.message ||
              "Không thể tải khách hàng qua API Gateway."
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
    { key: "full_name", header: "Họ tên" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Điện thoại" },
    { key: "city", header: "Thành phố" },
    { key: "gender", header: "Giới tính" },
    {
      key: "is_active",
      header: "Hoạt động",
      render: (r) => (r.is_active ? "Có" : "Không"),
    },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Khách hàng</h1>
        <p className="text-sm text-slate-500">Dữ liệu khách hàng qua API Gateway</p>
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
          searchPlaceholder="Tìm theo tên, email, SĐT…"
        />
      ) : null}
    </div>
  );
}
