import { useCallback, useEffect, useState } from "react";
import * as staffApi from "../api/staffApi";
import { DataTable } from "../components/DataTable";
import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingSpinner } from "../components/LoadingSpinner";

function unwrap(data) {
  return data?.results ?? data ?? [];
}

function Badge({ children, tone }) {
  const tones = {
    slate: "bg-slate-100 text-slate-800 ring-slate-200",
    sky: "bg-sky-100 text-sky-900 ring-sky-200",
    violet: "bg-violet-100 text-violet-900 ring-violet-200",
  };
  const cls = tones[tone] || tones.slate;
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${cls}`}
    >
      {children}
    </span>
  );
}

export default function StaffPage() {
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
          ? await staffApi.search(q.trim(), { limit: 100 })
          : await staffApi.getAll({ limit: 100 });
        if (!cancelled) setRows(unwrap(data));
      } catch (e) {
        if (!cancelled)
          setError(
            e?.response?.data?.detail ||
              e.message ||
              "Không thể tải nhân viên qua API Gateway."
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
    {
      key: "role",
      header: "Vai trò",
      render: (r) => <Badge tone="sky">{r.role}</Badge>,
    },
    {
      key: "department",
      header: "Phòng ban",
      render: (r) => <Badge tone="violet">{r.department}</Badge>,
    },
    {
      key: "salary",
      header: "Lương (₫)",
      render: (r) =>
        new Intl.NumberFormat("vi-VN").format(Number(r.salary || 0)),
    },
    {
      key: "is_active",
      header: "Hoạt động",
      render: (r) => (r.is_active ? "Có" : "Không"),
    },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Nhân viên</h1>
        <p className="text-sm text-slate-500">Dữ liệu nhân viên qua API Gateway</p>
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
          searchPlaceholder="Tìm theo tên, email, phòng ban…"
        />
      ) : null}
    </div>
  );
}
