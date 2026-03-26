import { createContext, useCallback, useContext, useMemo, useState } from "react";
import * as customerAuthApi from "../api/authCustomerApi";
import * as staffAuthApi from "../api/authStaffApi";

const STORAGE_KEY = "ecom_auth_v1";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const p = JSON.parse(raw);
      if (p?.role === "staff" && p?.token && p?.staff) return p;
      if (p?.role === "customer" && p?.token && p?.customer) return p;
    } catch {
      /* ignore */
    }
    return null;
  });

  const persist = useCallback((next) => {
    if (!next) {
      localStorage.removeItem(STORAGE_KEY);
      setState(null);
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setState(next);
  }, []);

  const loginStaff = useCallback(
    async (email, password) => {
      const { token, staff } = await staffAuthApi.login(email, password);
      persist({ role: "staff", token, staff });
      return staff;
    },
    [persist]
  );

  const loginCustomer = useCallback(
    async (email, password) => {
      const { token, customer } = await customerAuthApi.login(email, password);
      persist({ role: "customer", token, customer });
      return customer;
    },
    [persist]
  );

  const logout = useCallback(() => persist(null), [persist]);

  const registerCustomer = useCallback(
    async (payload) => customerAuthApi.register(payload),
    []
  );

  const value = useMemo(
    () => ({
      user: state,
      staff: state?.role === "staff" ? state.staff : null,
      customer: state?.role === "customer" ? state.customer : null,
      token: state?.token ?? null,
      isStaff: state?.role === "staff",
      isCustomer: state?.role === "customer",
      loginStaff,
      loginCustomer,
      logout,
      registerCustomer,
    }),
    [state, loginStaff, loginCustomer, logout, registerCustomer]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
