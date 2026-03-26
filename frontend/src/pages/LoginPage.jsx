import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { loginStaff, loginCustomer } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const from = loc.state?.from;

  const [tab, setTab] = useState(() =>
    from?.includes("staff") || from?.includes("kho") ? "staff" : "customer"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      if (tab === "staff") {
        await loginStaff(email, password);
        nav(
          typeof from === "string" && from.startsWith("/staff")
            ? from
            : "/staff/kho-laptop",
          { replace: true }
        );
      } else {
        await loginCustomer(email, password);
        nav(
          typeof from === "string" && from !== "/login" ? from : "/cart",
          { replace: true }
        );
      }
    } catch (e2) {
      setErr(e2?.response?.data?.detail || e2.message || "Đăng nhập thất bại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Đăng nhập</h1>
      <div className="flex rounded-lg bg-slate-100 p-1 text-sm font-medium">
        <button
          type="button"
          className={`flex-1 rounded-md py-2 ${
            tab === "customer" ? "bg-white shadow text-sky-700" : "text-slate-600"
          }`}
          onClick={() => setTab("customer")}
        >
          Khách hàng
        </button>
        <button
          type="button"
          className={`flex-1 rounded-md py-2 ${
            tab === "staff" ? "bg-white shadow text-sky-700" : "text-slate-600"
          }`}
          onClick={() => setTab("staff")}
        >
          Nhân viên (kho)
        </button>
      </div>
      <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        {err ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{err}</p>
        ) : null}
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder={tab === "staff" ? "nguyenquochuy@shop.vn" : "nguyenvanan@example.com"}
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Mật khẩu
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder={tab === "staff" ? "Staff@123" : "Khach@123"}
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-sky-600 py-2.5 font-medium text-white hover:bg-sky-700 disabled:opacity-60"
        >
          {loading ? "Đang xử lý…" : "Đăng nhập"}
        </button>
      </form>
      {tab === "customer" ? (
        <p className="text-center text-sm text-slate-600">
          Chưa có tài khoản?{" "}
          <Link to="/dang-ky" className="font-medium text-sky-600 hover:underline">
            Đăng ký
          </Link>
        </p>
      ) : (
        <p className="text-center text-xs text-slate-500">
          Demo: <code className="rounded bg-slate-100 px-1">Staff@123</code> với email nhân viên seed.
        </p>
      )}
    </div>
  );
}
