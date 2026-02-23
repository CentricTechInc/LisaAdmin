import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import React, { useEffect } from "react";
import Cookies from "js-cookie";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const isAuthPage = router.pathname.startsWith("/auth");

  useEffect(() => {
    const token = Cookies.get("token");

    if (!isLoading) {
      if (!token && !isAuthPage) {
        router.push("/auth/login");
      } else if (token && isAuthPage) {
        router.push("/dashboard");
      }
    }
  }, [isLoading, isAuthPage, router]);

  if (isLoading) {
    return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
  }

  // If not authenticated and trying to access protected route, render nothing while redirecting
  if (!isAuthenticated && !isAuthPage) {
    return null; 
  }

  return <>{children}</>;
};

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  // Ensure we correctly identify auth pages and root
  const isAuthPage = router.pathname.startsWith("/auth") || router.pathname === "/";

  return (
    <AuthProvider>
      <AuthGuard>
        {isAuthPage ? (
          <Component {...pageProps} />
        ) : (
          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>
        )}
      </AuthGuard>
    </AuthProvider>
  );
}
