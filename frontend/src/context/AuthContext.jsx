import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const BASE_URL = "http://localhost:5000/api";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => window.localStorage.getItem("electro-token"));
  const [user, setUser] = useState(() => {
    const saved = window.localStorage.getItem("electro-user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (token) window.localStorage.setItem("electro-token", token);
    else window.localStorage.removeItem("electro-token");
  }, [token]);

  useEffect(() => {
    if (user) window.localStorage.setItem("electro-user", JSON.stringify(user));
    else window.localStorage.removeItem("electro-user");
  }, [user]);

  async function login(email, password) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }

  async function register(name, email, password) {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Registration failed");
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ token, user, login, register, logout, isAdmin: user?.role === "admin" }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
