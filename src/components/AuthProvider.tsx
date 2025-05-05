import React, { createContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthContext, AuthState } from "@/lib/auth";
import { User, UserRole } from "@/types";
import { useToast } from "@/components/ui/use-toast";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const { toast } = useToast();
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
  });

  useEffect(() => {
    // Initialize auth state
    const initializeAuth = async () => {
      try {
        // Set up auth state listener FIRST
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (session) {
              fetchUserProfile(session.user.id, session);
            } else {
              setAuth({
                user: null,
                session: null,
                isLoading: false,
              });
            }
          }
        );

        // THEN check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          await fetchUserProfile(session.user.id, session);
        } else {
          setAuth({
            user: null,
            session: null,
            isLoading: false,
          });
        }

        return () => subscription.unsubscribe();
      } catch (error) {
        console.error("Error initializing auth:", error);
        setAuth({
          user: null,
          session: null,
          isLoading: false,
        });
      }
    };

    initializeAuth();
  }, []);

  const fetchUserProfile = async (userId: string, session: any) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        // Instead of directly accessing company_role, we'll use the raw user metadata
        // from the session as a fallback since that's where it gets stored during signup
        const companyRole = data.company_role || 
                           session.user.user_metadata?.company_role || 
                           null;

        setAuth({
          user: {
            id: userId,
            email: session.user.email || data.email || "",
            firstName: data.first_name,
            lastName: data.last_name,
            phone: data.phone,
            address: data.address,
            birthDate: data.birth_date,
            role: data.role as UserRole,
            createdAt: data.created_at,
            businessSector: data.business_sector,
            companyName: data.company_name,
            managerName: data.manager_name,
            companyRole: companyRole, // Use the resolved company role
          },
          session,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setAuth({
        user: null,
        session: null,
        isLoading: false,
      });
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: error.message,
        });
        return { error };
      }

      return { error: null };
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: error.message,
      });
      return { error };
    }
  };

  const signUp = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    address?: string;
    birthDate?: string;
    businessSector: string;
    managerName: string;
    companyName: string;
    role?: UserRole;
  }) => {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        phone,
        address,
        birthDate,
        businessSector,
        managerName,
        companyName,
      } = userData;
      const role = userData.role || UserRole.CLIENT;

      // Register the user with metadata that will be stored in the profiles table
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone: phone || "",
            address: address || "",
            birth_date: birthDate || "",
            business_sector: businessSector,
            manager_name: managerName,
            company_name: companyName,
            role: role,
            email: email, // Explicitly store email in metadata
          },
        },
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Erreur d'inscription",
          description: error.message,
        });
        return { error };
      }

      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès.",
      });
      
      return { error: null };
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: error.message,
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setAuth({
        user: null,
        session: null,
        isLoading: false,
      });
      
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
      });
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast({
        variant: "destructive",
        title: "Erreur de déconnexion",
        description: error.message,
      });
    }
  };

  const hasRole = (requiredRole: UserRole | UserRole[]) => {
    if (!auth.user) return false;
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(auth.user.role);
    }
    
    return auth.user.role === requiredRole;
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        signIn,
        signUp,
        signOut,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
