import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [tokens, setTokens] = useState(() => {
    const storedTokens = localStorage.getItem("tokens");
    return storedTokens ? JSON.parse(storedTokens) : null;
  });

  // 🔹 Login
  const login = async (email, password) => {
    const response = await api.post("/accounts/login/", { email, password });
    const { user, tokens } = response.data;

    setUser(user);
    setTokens(tokens);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("tokens", JSON.stringify(tokens));

    return user;
  };

  // 🔹 Signup
  const signup = async (name, email, role, password) => {
    const response = await api.post("/accounts/signup/", {
      name,
      email,
      role,
      password,
    });
    const { user, tokens } = response.data;

    setUser(user);
    setTokens(tokens);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("tokens", JSON.stringify(tokens));

    return user;
  };

  // 🔹 Logout
  const logout = () => {
    setUser(null);
    setTokens(null);
    localStorage.removeItem("user");
    localStorage.removeItem("tokens");
  };

  // 🔹 Always set access token on mount / token change
  useEffect(() => {
    if (tokens?.access) {
      api.defaults.headers.common["Authorization"] = `Bearer ${tokens.access}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [tokens]);

  // 🔹 Axios interceptor for auto token refresh
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry && tokens?.refresh) {
          originalRequest._retry = true;
          try {
            const refreshResponse = await api.post("/accounts/token/refresh/", {
              refresh: tokens.refresh,
            });

            const newTokens = {
              ...tokens,
              access: refreshResponse.data.access,
            };

            setTokens(newTokens);
            localStorage.setItem("tokens", JSON.stringify(newTokens));

            api.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${newTokens.access}`;
            originalRequest.headers["Authorization"] = `Bearer ${newTokens.access}`;

            return api(originalRequest);
          } catch (err) {
            console.error("Token refresh failed:", err);
            logout();
          }
        }

        return Promise.reject(error);
      }
    );

    return () => api.interceptors.response.eject(interceptor);
  }, [tokens]);

  return (
    <AuthContext.Provider value={{ user, tokens, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
