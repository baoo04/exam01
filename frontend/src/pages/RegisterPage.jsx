import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { registerCustomer, loginCustomer } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    city: "Hà Nội",
    gender: "Nam",
    date_of_birth: "",
  });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const payload = {
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        address: form.address,
        city: form.city,
        gender: form.gender,
        is_active: true,
      };
      if (form.date_of_birth) payload.date_of_birth = form.date_of_birth;
      await registerCustomer(payload);
      await loginCustomer(form.email, form.password);
      nav("/cart", { replace: true });
    } catch (e2) {
      const d = e2?.response?.data;
      setErr(
        typeof d === "object" && d
          ? JSON.stringify(d)
          : d?.detail || e2.message || "Đăng ký thất bại."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-6 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Đăng ký khách hàng</h1>
      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        {err ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 break-words">
            {err}
          </p>
        ) : null}
        <label className="block text-sm font-medium text-slate-700">
          Họ tên
          <input
            required
            value={form.full_name}
            onChange={(e) => set("full_name", e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Mật khẩu (≥ 6 ký tự)
          <input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Điện thoại
          <input
            required
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Địa chỉ
          <textarea
            required
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            rows={2}
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Thành phố
          <input
            required
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Giới tính
          <select
            value={form.gender}
            onChange={(e) => set("gender", e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Ngày sinh (tùy chọn)
          <input
            type="date"
            value={form.date_of_birth}
            onChange={(e) => set("date_of_birth", e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-emerald-600 py-2.5 font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {loading ? "Đang xử lý…" : "Tạo tài khoản"}
        </button>
      </form>
      <p className="text-center text-sm text-slate-600">
        Đã có tài khoản?{" "}
        <Link to="/login" className="font-medium text-sky-600 hover:underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
