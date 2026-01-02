import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/router";
import api, { ApiResponse } from "@/utils/axios";
import { AxiosError } from "axios";
import Cookies from "js-cookie";

// Define types for User and AuthState
interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
}

interface LoginResponse {
  data: User;
  token: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, fcm_token: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  verifyOtp: (email: string, otp: number) => Promise<void>;
  regenerateOtp: (email: string) => Promise<void>;
  resetPassword: (email: string, password: string, confirm_password: string) => Promise<void>;
  error: string | null;
  success: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for stored token and user on mount
    const token = Cookies.get("token");
    const storedUser = Cookies.get("user");

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } catch (e) {
        console.error("Failed to parse user from cookies", e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, fcm_token: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      // Adjust the endpoint as per your actual API
      const response = await api.post<ApiResponse<any>>("/auth/login", { email, password, fcm_token });
      
      // Store token and user in Cookies (expire in 7 days)
      Cookies.set("token", response.data.data.data.token, { expires: 7 });
      Cookies.set("user", JSON.stringify(response.data.data.data), { expires: 7 });
      
      // Also keep in localStorage for backup if needed (optional, but good for redundancy)
      localStorage.setItem("token", response.data.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data.data));

      // Set axios default header for future requests
      api.defaults.headers.common["Authorization"] = `Bearer ${response.data.data.data.token}`;

      setUser(response.data.data.data as any);
      setSuccess(response.data.data.message || "Login successful");
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
    Cookies.remove("token");
    Cookies.remove("user");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    router.push("/auth/login");
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await api.get<ApiResponse<any>>(`/auth/forgot-password/${email}`);
      setSuccess(response.data.data.message || "Reset link sent.");
    } catch (err) {
      const axiosError = err as any;
      
      let message = axiosError.message || "Request failed";
      
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

  const verifyOtp = async (email: string, otp: number) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await api.post<ApiResponse<any>>(`/auth/verify-otp/${email}`, { otp });
      setSuccess(response.data.data.message || "OTP Verified Successfully.");
      router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      const axiosError = err as any;
      
      let message = axiosError.message || "Verification failed";
      
      if (axiosError?.data?.errors && Array.isArray(axiosError.data.errors)) {
        message = axiosError.data.errors.join("\n");
      } else if (typeof axiosError?.data?.message === 'string') {
        message = axiosError.data.message;
      } else if (axiosError?.response?.data?.message) {
         message = axiosError.response.data.message;
      }

      setError(message);
      throw { message }; // Re-throw object with message property
    } finally {
      setIsLoading(false);
    }
  };

  const regenerateOtp = async (email: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await api.get<ApiResponse<any>>(`/auth/regenerate-otp/${email}`);
      setSuccess(response.data.data.message || "OTP resent successfully.");
    } catch (err) {
      const axiosError = err as any;
      
      let message = axiosError.message || "Resend failed";
      
      if (axiosError?.data?.errors && Array.isArray(axiosError.data.errors)) {
        message = axiosError.data.errors.join("\n");
      } else if (typeof axiosError?.data?.message === 'string') {
        message = axiosError.data.message;
      } else if (axiosError?.response?.data?.message) {
         message = axiosError.response.data.message;
      }
      
      setError(message);
      throw { message };
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string, password: string, confirm_password: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await api.post<ApiResponse<any>>(`/auth/reset-password/${email}`, { 
        password, 
        confirm_password 
      });
      setSuccess(response.data.data.message || "Password reset successfully.");
      router.push("/auth/login");
    } catch (err) {
      const axiosError = err as any;
      
      let message = axiosError.message || "Reset password failed";
      
      if (axiosError?.data?.errors && Array.isArray(axiosError.data.errors)) {
        message = axiosError.data.errors.join("\n");
      } else if (typeof axiosError?.data?.message === 'string') {
        message = axiosError.data.message;
      } else if (axiosError?.response?.data?.message) {
         message = axiosError.response.data.message;
      }
      
      setError(message);
      throw { message };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, forgotPassword, verifyOtp, regenerateOtp, resetPassword, error, success }}>
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
