
import { createContext, useContext } from "react";
import { User, UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export interface AuthState {
  user: User | null;
  session: any | null;
  isLoading: boolean;
}

export interface AuthContextProps {
  auth: AuthState;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    address?: string;
    birthDate?: string;
    businessSector?: string;
    managerName?: string;
    companyName?: string;
    role?: UserRole;
  }) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  hasRole: (requiredRole: UserRole | UserRole[]) => boolean;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const hasRequiredRole = (
  userRole: UserRole | undefined,
  requiredRole: UserRole | UserRole[]
): boolean => {
  if (!userRole) return false;
  
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole);
  }
  
  return userRole === requiredRole;
};
