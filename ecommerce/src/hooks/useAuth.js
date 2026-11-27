import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Returns { token, role, isAdmin, login, logout }
 * Use anywhere inside <AuthProvider>.
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
