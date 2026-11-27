import { Navigate } from "react-router-dom";

/**
 * Redirects to /login if the user has no token.
 */
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
