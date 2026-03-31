import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as cartApi from "../api/cartApi";
import { DataTable } from "../components/DataTable";
import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { formatVnd } from "../utils/formatVnd";

function unwrap(data) {
  return data?.results ?? data ?? [];
}

export default function CartPage() {
  const { isCustomer, customer } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [q, setQ] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const onSearch = useCallback((v) => setQ(v), []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!isCustomer || !customer?.id) {
        setRows([]);
        setLoading(false);
        setError(null);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await cartApi.listForCustomer(customer.id, { limit: 50 });
        let list = unwrap(data).filter(
          (c) => String(c.customer_id) === String(customer.id)
        );
        const qq = q.trim().toLowerCase();
        if (qq) {
          list = list.filter((c) =>
            (c.items || []).some((it) =>
              (it.product_name || "").toLowerCase().includes(qq)
            )
          );
        }
        if (!cancelled) setRows(list);
      } catch (e) {
        if (!cancelled)
          setError(
            e?.response?.data?.detail ||
              e.message ||
              "Không thể tải giỏ hàng qua API Gateway."
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [q, refreshKey, isCustomer, customer?.id]);

  const columns = [
    {
      key: "id",
      header: "Giỏ",
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
      key: "items",
      header: "Sản phẩm trong giỏ",
      render: (r) => (
        <div className="max-w-lg space-y-2">
          {(r.items || []).map((it) => (
            <div
              key={it.id}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs"
            >
              <p className="font-semibold text-slate-900">{it.product_name}</p>
              <p className="text-slate-600">
                Loại: {it.product_type} · SL: {it.quantity} · Đơn giá:{" "}
                {formatVnd(it.unit_price)}
              </p>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "updated_at",
      header: "Cập nhật",
      render: (r) =>
        r.updated_at ? new Date(r.updated_at).toLocaleString("vi-VN") : "—",
    },
  ];

  if (!isCustomer) {
    return (
      <div className="space-y-4 rounded-xl border border-amber-200 bg-amber-50 p-6">
        <h1 className="text-xl font-bold text-slate-900">Giỏ hàng</h1>
        <p className="text-slate-700">
          Vui lòng{" "}
          <Link to="/login" className="font-medium text-sky-700 underline">
            đăng nhập tài khoản khách hàng
          </Link>{" "}
          để xem giỏ của bạn, hoặc{" "}
          <Link to="/dang-ky" className="font-medium text-sky-700 underline">
            đăng ký mới
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Giỏ hàng của bạn</h1>
        <p className="text-sm text-slate-500">
          Xin chào <strong>{customer.full_name}</strong> — giỏ hàng qua API Gateway
        </p>
      </header>
      {error ? (
        <ErrorMessage
          message={error}
          onRetry={() => setRefreshKey((k) => k + 1)}
        />
      ) : null}
      {loading ? <LoadingSpinner /> : null}
      {!loading && !error && rows.length === 0 ? (
        <p className="rounded-lg border border-slate-200 bg-white p-6 text-slate-600">
          Giỏ trống. Thêm sản phẩm từ trang{" "}
          <Link to="/laptops" className="text-sky-600 underline">
            Laptop
          </Link>{" "}
          hoặc{" "}
          <Link to="/mobiles" className="text-sky-600 underline">
            Điện thoại
          </Link>
          ,{" "}
          <Link to="/clothes" className="text-sky-600 underline">
            Quần áo
          </Link>
          .
        </p>
      ) : null}
      {!loading && !error && rows.length > 0 ? (
        <DataTable
          columns={columns}
          data={rows}
          onSearch={onSearch}
          searchPlaceholder="Tìm theo tên sản phẩm trong giỏ…"
        />
      ) : null}
    </div>
  );
}
