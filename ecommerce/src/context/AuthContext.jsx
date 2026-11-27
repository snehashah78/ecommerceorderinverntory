import { createContext, useState } from "react";

export const AuthContext = createContext();

/**
 * Stores { token, role } in localStorage.
 * role is "admin" | "viewer"  (default: "viewer")
 *
 * To log in as admin during development call:
 *   login(token, "admin")
 */
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  );
  const [role, setRole] = useState(
    () => localStorage.getItem("role") || "viewer"
  );

  const login = (newToken, newRole = "viewer") => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newRole);
    setToken(newToken);
    setRole(newRole);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole("viewer");
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout, isAdmin: role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
};
