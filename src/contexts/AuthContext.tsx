import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
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

export const AuthProvider = ({ children, setPage }: { children: React.ReactNode; setPage: (page: string) => void }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasLoadedOnce = useRef(false);

  const refetchUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiFetch("/api/auth/me");
      const fetchedUser = res.ok ? await res.json() : null;
      setUser(fetchedUser);
      if (hasLoadedOnce.current) {
        if (fetchedUser === null) {
          setPage("kiosk");
        } else if (fetchedUser.role === "Manager") {
          setPage("manager");
        } else {
          setPage("cashier");
        }
      }
    } catch {
      setUser(null);
      if (hasLoadedOnce.current) {
        setPage("kiosk");
      }
    } finally {
      setIsLoading(false);
    }
  }, [setPage]);

  useEffect(() => {
    refetchUser().then(() => {
      hasLoadedOnce.current = true;
    });
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
    setPage("kiosk");
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
