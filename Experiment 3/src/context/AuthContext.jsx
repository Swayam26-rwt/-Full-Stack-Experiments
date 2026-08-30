import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, setAccessToken } from "../services/api";
import { createDemoToken, decodeToken } from "../utils/jwt";

const AuthContext = createContext(null);

const DEMO_USERS = {
  admin: { password: "admin123", role: "admin", name: "Aarav Admin" },
  editor: { password: "editor123", role: "editor", name: "Riya Editor" },
  viewer: { password: "viewer123", role: "viewer", name: "Kabir Viewer" }
};

export function AuthProvider({ children }) {
  const [accessToken, setToken] = useState(() => localStorage.getItem("accessToken"));
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("accessToken");
    return token ? decodeToken(token) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAccessToken(accessToken);
    setLoading(false);
  }, [accessToken]);

  async function login(username, password) {
    const account = DEMO_USERS[username];

    if (!account || account.password !== password) {
      throw new Error("Invalid username or password");
    }

    // Demo-only JWT generation. In production, the backend signs the JWT.
    const token = createDemoToken({
      userId: username,
      name: account.name,
      role: account.role
    });

    localStorage.setItem("accessToken", token);
    localStorage.setItem("refreshToken", `refresh-${username}-demo`);
    setToken(token);
    setUser(decodeToken(token));

    // Demonstrates the centralized API layer.
    await api.get("/session");
  }

  function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAccessToken(null);
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, accessToken, loading, login, logout }),
    [user, accessToken, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
