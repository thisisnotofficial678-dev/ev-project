import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authAPI, userAPI, User } from "../services/api";

type AuthContextValue = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { name: string; email: string; phone: string; vehicleType: string; password: string }) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("evslot:token");
      if (token) {
        try {
          const userData = await userAPI.getProfile();
          setUser(userData);
        } catch (err) {
          console.error("Failed to get user profile:", err);
          localStorage.removeItem("evslot:token");
          localStorage.removeItem("evslot:user");
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    error,
    login: async (email: string, password: string) => {
      try {
        setLoading(true);
        setError(null);
        const { user: userData, token } = await authAPI.login({ email, password });
        setUser(userData);
        localStorage.setItem("evslot:user", JSON.stringify(userData));
        localStorage.setItem("evslot:token", token);
      } catch (err: any) {
        setError(err.message || "Login failed");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    register: async (userData) => {
      try {
        setLoading(true);
        setError(null);
        const { user: newUser, token } = await authAPI.register(userData);
        setUser(newUser);
        localStorage.setItem("evslot:user", JSON.stringify(newUser));
        localStorage.setItem("evslot:token", token);
      } catch (err: any) {
        setError(err.message || "Registration failed");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    logout: () => {
      setUser(null);
      setError(null);
      localStorage.removeItem("evslot:user");
      localStorage.removeItem("evslot:token");
    },
  }), [user, loading, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};


