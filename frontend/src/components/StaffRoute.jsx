import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function StaffRoute({ children }) {
  const { isStaff } = useAuth();
  const loc = useLocation();
  if (!isStaff) {
    return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  }
  return children;
}
