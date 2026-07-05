import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { getCurrentUser, loginUser, registerUser } from "../api/auth";
import { getToken, setToken } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setInitializing(false);
      return;
    }
    getCurrentUser()
      .then((profile) => setUser(profile))
      .catch(() => {
        setToken(null);
        setUser(null);
      })
      .finally(() => setInitializing(false));
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const { access_token } = await loginUser({ email, password });
    setToken(access_token);
    const profile = await getCurrentUser();
    setUser(profile);
    return profile;
  }, []);

  const register = useCallback(async (payload) => {
    await registerUser(payload);
    return login({ email: payload.email, password: payload.password });
  }, [login]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const value = { user, role: user?.role ?? null, initializing, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
