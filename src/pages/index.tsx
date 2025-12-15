import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { GreetingHeader } from "@/components/layout/GreetingHeader";

export default function IndexPage() {
  return (
    <div className="flex min-h-screen bg-[var(--color-surface)]">
      <Sidebar activeId="appointments" />
      <main className="flex-1 px-2 py-2">
        <div className="w-full">
          <GreetingHeader userName="Alison" />
        </div>
      </main>
    </div>
  );
}
