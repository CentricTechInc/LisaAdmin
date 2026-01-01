import React from "react";
import { useRouter } from "next/router";
import { Sidebar } from "./Sidebar";
import { GreetingHeader } from "./GreetingHeader";
import { useAuth } from "@/contexts/AuthContext";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const router = useRouter();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-screen bg-[#F9FAFB] overflow-hidden">
      <Sidebar onLogout={handleLogout} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="p-6 pb-0">
          <GreetingHeader 
            userName={user?.name || "User"} 
            onLogoutClick={handleLogout}
            avatarSrc={user?.avatar}
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
