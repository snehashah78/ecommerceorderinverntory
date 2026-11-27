import { Navigate } from "react-router-dom";

/**
 * Allows access only when role === "admin".
 * Redirects to /dashboard otherwise.
 */
function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const role  = localStorage.getItem("role");

  if (!token)            return <Navigate to="/login"     replace />;
  if (role !== "admin")  return <Navigate to="/dashboard" replace />;

  return children;
}

export default AdminRoute;
