import { Routes, Route } from "react-router-dom";
import Home         from "./pages/Home/Home";
import Login        from "./pages/Login/Login";
import Signup       from "./pages/Signup/Signup";
import VerifyOtp    from "./pages/VerifyOtp/VerifyOtp";
import OtpLogin     from "./pages/OtpLogin/OtpLogin";
import Dashboard    from "./pages/Dashboard/Dashboard";
import Products     from "./pages/Product/Product";
import Cart         from "./pages/Cart/Cart";
import Orders       from "./pages/Orders/Orders";
import OrderPayment from "./pages/payment/OrderPayment";
import Inventory    from "./pages/Inventory/Inventory";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute   from "./components/AdminRoute";

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"          element={<Home />} />
      <Route path="/login"     element={<Login />} />
      <Route path="/signup"    element={<Signup />} />
      <Route path="/verify"    element={<VerifyOtp />} />
      <Route path="/otp-login" element={<OtpLogin />} />

      {/* Authenticated (any logged-in user) */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/products"  element={<ProtectedRoute><Products /></ProtectedRoute>} />
      <Route path="/cart"      element={<ProtectedRoute><Cart /></ProtectedRoute>} />
      <Route path="/orders"    element={<ProtectedRoute><Orders /></ProtectedRoute>} />
      <Route path="/payment"   element={<ProtectedRoute><OrderPayment /></ProtectedRoute>} />

      {/* Inventory — viewers can browse, admins can manage
          Both roles see this page; the admin controls render conditionally inside */}
      <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />

      {/* Optional: a pure admin-only route that rejects viewers at the route level */}
      <Route path="/admin/inventory" element={<AdminRoute><Inventory /></AdminRoute>} />
    </Routes>
  );
}

export default App;