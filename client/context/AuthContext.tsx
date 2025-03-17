"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

type User = {
  id: string;
  name: string;
  email: string;
  role: "student" | "tutor" | "parent" | "admin";
  avatar?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, this would verify the token with your backend
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Authentication error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Redirect based on auth status and role
  useEffect(() => {
    if (!isLoading) {
      const publicRoutes = ["/login", "/register", "/reset-password"];
      const isPublicRoute = publicRoutes.some((route) =>
        pathname?.startsWith(route)
      );

      if (!user && !isPublicRoute) {
        router.push("/login");
      } else if (user && isPublicRoute) {
        // Redirect to appropriate dashboard based on role
        if (user.role === "student") router.push("/dashboard");
        else if (user.role === "tutor") router.push("/tutor-dashboard");
        else if (user.role === "parent") router.push("/parent-dashboard");
        else if (user.role === "admin") router.push("/admin");
      }
    }
  }, [user, isLoading, pathname, router]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock API call - replace with actual API integration
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password }),
      // });
      // const data = await response.json();

      // Mock successful login
      const mockUser = {
        id: "user-123",
        name: "John Doe",
        email: email,
        role: email.includes("admin")
          ? "admin"
          : email.includes("tutor")
          ? "tutor"
          : email.includes("parent")
          ? "parent"
          : "student",
        avatar: "/placeholder.svg?height=40&width=40",
      } as User;

      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));

      // Redirect based on role
      if (mockUser.role === "student") router.push("/dashboard");
      else if (mockUser.role === "tutor") router.push("/tutor-dashboard");
      else if (mockUser.role === "parent") router.push("/parent-dashboard");
      else if (mockUser.role === "admin") router.push("/admin");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    setIsLoading(true);
    try {
      // Mock API call - replace with actual API integration
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(userData),
      // });
      // const data = await response.json();

      // Mock successful registration
      router.push("/login?registered=true");
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    router.push("/login");
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      // Mock API call - replace with actual API integration
      // const response = await fetch('/api/auth/reset-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // });
      // const data = await response.json();

      // Mock successful password reset request
      router.push("/login?reset=requested");
    } catch (error) {
      console.error("Password reset error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, register, logout, resetPassword }}
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
  return context;
}
