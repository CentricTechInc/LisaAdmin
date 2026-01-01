import React from "react";
import { useRouter } from "next/router";
import { Sidebar } from "./Sidebar";
import { GreetingHeader } from "./GreetingHeader";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const router = useRouter();

  const handleLogout = () => {
    // Navigate to the login page
    router.push("/auth/login");
  };

  return (
    <div className="flex h-screen bg-[#F9FAFB] overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="p-6 pb-0">
          <GreetingHeader 
            userName="Alison" 
            onLogoutClick={handleLogout}
          />
        </div>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
