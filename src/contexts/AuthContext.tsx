import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "../types/models";
import { apiFetch, API_BASE_URL } from "../api/http";

interface IAuthContext {
  user: User | null;
  isLoading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  refetchUser: () => void;
}
const AuthContext = createContext<IAuthContext | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refetchUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiFetch("/api/auth/me");
      setUser(res.ok ? await res.json() : null);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetchUser();
  }, [refetchUser]);

  const login = () => {
    window.location.href = `${API_BASE_URL}/api/auth/login`;
  };
  const logout = async () => {
    await apiFetch("/api/auth/logout");
    setUser(null);
    localStorage.removeItem("momtea.page");
    localStorage.removeItem("momtea.tab");
    localStorage.removeItem("kiosk.highContrast");
    window.location.reload();
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, logout, refetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
