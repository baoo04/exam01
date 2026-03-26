import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LINKS = [
  { to: "/laptops", label: "Laptop", icon: "💻" },
  { to: "/mobiles", label: "Điện thoại", icon: "📱" },
  { to: "/clothes", label: "Quần áo", icon: "👕" },
  { to: "/customers", label: "Khách hàng", icon: "👤" },
  { to: "/staff", label: "Nhân viên", icon: "🧑‍💼" },
  { to: "/orders", label: "Đơn hàng", icon: "📦" },
  { to: "/cart", label: "Giỏ hàng", icon: "🛒" },
  { to: "/shipping", label: "Vận chuyển", icon: "🚚" },
];

const STAFF_STOCK = [
  { to: "/staff/kho-laptop", label: "Kho laptop", icon: "📥" },
  { to: "/staff/kho-mobile", label: "Kho điện thoại", icon: "📲" },
  { to: "/staff/kho-clothes", label: "Kho quần áo", icon: "🧥" },
];

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const {
    isStaff,
    isCustomer,
    staff,
    customer,
    logout,
  } = useAuth();

  return (
    <>
      <button
        type="button"
        className="fixed left-3 top-3 z-40 rounded-lg bg-sidebar p-2 text-white shadow-lg lg:hidden"
        onClick={() => setOpen((s) => !s)}
        aria-label="Menu"
      >
        ☰
      </button>
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-60 transform bg-sidebar text-slate-100 shadow-xl transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col border-r border-slate-700/50">
          <div className="border-b border-slate-700/50 px-5 py-6">
            <p className="text-lg font-bold tracking-tight">E‑Commerce</p>
            <p className="text-xs text-slate-400">Microservices</p>
            {isStaff && staff ? (
              <p className="mt-2 truncate text-xs text-emerald-300">
                NV: {staff.full_name}
              </p>
            ) : null}
            {isCustomer && customer ? (
              <p className="mt-2 truncate text-xs text-sky-300">
                KH: {customer.full_name}
              </p>
            ) : null}
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-sky-600 text-white shadow-inner"
                      : "text-slate-200 hover:bg-slate-700/60"
                  }`
                }
              >
                <span className="text-lg" aria-hidden>
                  {l.icon}
                </span>
                {l.label}
              </NavLink>
            ))}
            {isStaff ? (
              <div className="border-t border-slate-600/50 pt-3 mt-3">
                <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Quản lý kho
                </p>
                {STAFF_STOCK.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                        isActive
                          ? "bg-amber-600 text-white shadow-inner"
                          : "text-slate-200 hover:bg-slate-700/60"
                      }`
                    }
                  >
                    <span className="text-lg" aria-hidden>
                      {l.icon}
                    </span>
                    {l.label}
                  </NavLink>
                ))}
              </div>
            ) : null}
          </nav>
          <div className="border-t border-slate-700/50 p-3 space-y-2">
            {isStaff || isCustomer ? (
              <button
                type="button"
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="w-full rounded-lg bg-slate-700 px-3 py-2 text-left text-sm text-slate-100 hover:bg-slate-600"
              >
                Đăng xuất
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="block w-full rounded-lg bg-sky-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-sky-500"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/dang-ky"
                  onClick={() => setOpen(false)}
                  className="block w-full rounded-lg border border-slate-500 px-3 py-2 text-center text-sm text-slate-200 hover:bg-slate-700/50"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </aside>
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          aria-label="Đóng menu"
          onClick={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}
