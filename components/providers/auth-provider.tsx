"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  organizationId?: string; // Add organizationId to User interface
  departmentId?: string; // Add departmentId to User interface
  teamId?: string; // Add teamId to User interface
  departmentName?: string; // Optional, if needed
  teamName?: string; // Optional, if needed
  organizationName?: string; // Optional, if needed
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  getAuthHeaders: () => { Authorization: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Function to decode JWT and set user
  const decodeAndSetUser = useCallback(
    (token: string) => {
      try {
        // JWTs have three parts: header.payload.signature
        // The payload is the second part, which is base64-encoded.
        const payload = JSON.parse(atob(token.split(".")[1]));

        // Check if the token is expired
        if (payload.exp * 1000 > Date.now()) {
          setUser({
            id: payload.id,
            name: payload.username || payload.email, // Use username or email from payload
            email: payload.sub, // 'sub' is often the subject, e.g., user ID or email
            role: payload.role,
            organizationId: payload.organizationId, // Access organizationId from payload
            departmentId: payload.departmentId,
            teamId: payload.teamId,
            departmentName: payload.departmentName,
            teamName: payload.teamName,
            organizationName: payload.organizationName,
          });
          console.log(payload);
          setIsAuthenticated(true);
          return true;
        } else {
          // Token expired, clear it
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          return false;
        }
      } catch (error) {
        console.error("Error decoding token or setting user:", error);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        return false;
      }
    },
    [] // No dependencies needed for useCallback here
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      decodeAndSetUser(token);
    }
    setLoading(false);
  }, [decodeAndSetUser]);

  const getAuthHeadersForAuthenticatedCalls = useCallback(() => {
    const token = localStorage.getItem("token");
    return {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const { access_token } = await response.json();
      localStorage.setItem("token", access_token);
      decodeAndSetUser(access_token); // Decode and set user from the new token
      router.push("/dashboard");
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to log in.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const { access_token } = await response.json();
      localStorage.setItem("token", access_token);
      decodeAndSetUser(access_token); // Decode and set user from the new token
      router.push("/dashboard");
      toast({
        title: "Success",
        description: "Account created successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create account.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    router.push("/auth/login");
    toast({
      title: "Logged Out",
      description: "You have been logged out.",
    });
  }, [router, toast]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated,
        getAuthHeaders: getAuthHeadersForAuthenticatedCalls,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return {
    user: context.user,
    login: context.login,
    register: context.register,
    logout: context.logout,
    isLoading: context.loading,
    isAuthenticated: context.isAuthenticated,
    getAuthHeaders: context.getAuthHeaders,
  };
}
