import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Sidebar } from "@/components/layout/Sidebar";
import { GreetingHeader as Header } from "@/components/layout/GreetingHeader";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { Toaster } from 'react-hot-toast';

// Wrapper component to access auth context
const AppContent = ({ Component, pageProps }: { Component: any, pageProps: any }) => {
  const router = useRouter();
  const { user, logout } = useAuth();
  
  // Pages that don't need the dashboard layout (sidebar + header)
  const isAuthPage = router.pathname.startsWith("/auth") || router.pathname === "/";

  return (
    <>
      <Toaster position="top-right" />
      {isAuthPage ? (
        <Component {...pageProps} />
      ) : (
        <div className="flex min-h-screen bg-[#F9FAFB]">
          <Sidebar 
            className="hidden w-64 border-r border-gray-100 bg-white lg:block fixed h-full overflow-y-auto" 
            onLogout={logout}
          />
          <div className="flex flex-1 flex-col lg:pl-64">
            <Header 
              className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur-md" 
              userName={user?.name || "User"}
              onLogoutClick={logout}
              avatarSrc={user?.avatar}
            />
            <main className="flex-1 p-6">
              <Component {...pageProps} />
            </main>
          </div>
        </div>
      )}
    </>
  );
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <AppContent Component={Component} pageProps={pageProps} />
    </AuthProvider>
  );
}
