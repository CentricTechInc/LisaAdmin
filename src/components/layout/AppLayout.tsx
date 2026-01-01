import React from "react";
import { Sidebar } from "./Sidebar";
import { GreetingHeader } from "./GreetingHeader";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-[#F9FAFB] overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="p-6 pb-0">
          <GreetingHeader userName="Alison" />
        </div>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
