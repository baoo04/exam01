import { Navigate, Route, Routes } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { StaffRoute } from "./components/StaffRoute";
import CartPage from "./pages/CartPage.jsx";
import CustomersPage from "./pages/CustomersPage.jsx";
import ClothesPage from "./pages/ClothesPage.jsx";
import LaptopsPage from "./pages/LaptopsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import MobilesPage from "./pages/MobilesPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ShippingPage from "./pages/ShippingPage.jsx";
import StaffClothesPage from "./pages/StaffClothesPage.jsx";
import StaffLaptopsPage from "./pages/StaffLaptopsPage.jsx";
import StaffMobilesPage from "./pages/StaffMobilesPage.jsx";
import StaffPage from "./pages/StaffPage.jsx";

export default function App() {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-14 lg:px-8 lg:pt-8">
          <Routes>
            <Route path="/" element={<Navigate to="/laptops" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dang-ky" element={<RegisterPage />} />
            <Route path="/laptops" element={<LaptopsPage />} />
            <Route path="/mobiles" element={<MobilesPage />} />
            <Route path="/clothes" element={<ClothesPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/staff" element={<StaffPage />} />
            <Route
              path="/staff/kho-laptop"
              element={
                <StaffRoute>
                  <StaffLaptopsPage />
                </StaffRoute>
              }
            />
            <Route
              path="/staff/kho-mobile"
              element={
                <StaffRoute>
                  <StaffMobilesPage />
                </StaffRoute>
              }
            />
            <Route
              path="/staff/kho-clothes"
              element={
                <StaffRoute>
                  <StaffClothesPage />
                </StaffRoute>
              }
            />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/shipping" element={<ShippingPage />} />
            <Route path="*" element={<Navigate to="/laptops" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
