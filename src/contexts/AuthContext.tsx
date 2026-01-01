import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/router";
import api, { ApiResponse } from "@/utils/axios";
import { AxiosError } from "axios";

// Define types for User and AuthState
interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for stored token and user on mount
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Adjust the endpoint as per your actual API
      const response = await api.post<ApiResponse<LoginResponse>>("/auth/login", { email, password });
      
      const { user, token } = response.data.data; // Now response.data is ApiResponse<LoginResponse>, so .data is valid

      // Store token and user
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Set axios default header for future requests
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(user);
      router.push("/dashboard");
    } catch (err) {
      const axiosError = err as any;
      
      // Extract error message from API response if available
      let message = axiosError.message || "Login failed";
      
      if (axiosError?.data?.errors && Array.isArray(axiosError.data.errors)) {
        message = axiosError.data.errors.join("\n");
      } else if (typeof axiosError?.data?.message === 'string') {
        message = axiosError.data.message;
      }
      
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
