import { createContext, useContext, useState, ReactNode } from "react";

export interface User {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  state: string;
  cropType: string;
  soilType: string;
  farmerId: string;
  isPremium: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginDemo: () => void;
  register: (data: Omit<User, "id" | "farmerId" | "isPremium"> & { password: string }) => Promise<string>;
  logout: () => void;
  togglePremium: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function generateFarmerId(): string {
  const prefix = "AGR";
  const year = new Date().getFullYear().toString().slice(-2);
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${prefix}${year}-${random}`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 800));
    setUser({
      id: "1",
      fullName: "Ramesh Patil",
      email,
      mobile: "9876543210",
      state: "Maharashtra",
      cropType: "wheat",
      soilType: "loamy",
      farmerId: "AGR24-XY7K2",
      isPremium: false,
    });
  };

  const loginDemo = () => {
    setUser({
      id: "demo",
      fullName: "Demo Farmer",
      email: "demo@agrolens.in",
      mobile: "9000000000",
      state: "Punjab",
      cropType: "rice",
      soilType: "alluvial",
      farmerId: "AGR24-DEMO1",
      isPremium: false,
    });
  };

  const register = async (
    data: Omit<User, "id" | "farmerId" | "isPremium"> & { password: string }
  ): Promise<string> => {
    await new Promise((r) => setTimeout(r, 1000));
    const farmerId = generateFarmerId();
    const { password: _pw, ...rest } = data;
    setUser({ id: Date.now().toString(), farmerId, isPremium: false, ...rest });
    return farmerId;
  };

  const logout = () => setUser(null);

  const togglePremium = () => {
    setUser((prev) => prev ? { ...prev, isPremium: !prev.isPremium } : prev);
  };

  return (
    <AuthContext.Provider value={{ user, login, loginDemo, register, logout, togglePremium }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
