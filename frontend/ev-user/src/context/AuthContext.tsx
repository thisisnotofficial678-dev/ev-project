import { createContext, useContext, useEffect, useMemo, useState } from "react";

type User = { id: string; name: string; email: string } | null;

type AuthContextValue = {
  user: User;
  login: (user: NonNullable<User>) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    const raw = localStorage.getItem("evslot:user");
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    login: (u) => {
      setUser(u);
      localStorage.setItem("evslot:user", JSON.stringify(u));
    },
    logout: () => {
      setUser(null);
      localStorage.removeItem("evslot:user");
    },
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};


