import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { GreetingHeader } from "@/components/layout/GreetingHeader";
import { AppImage } from "@/components/ui/AppImage";

export default function IndexPage() {
  return (
    <div className="flex min-h-screen bg-[var(--color-surface)]">
      <Sidebar activeId="appointments" />
      <main className="flex-1 px-2 py-2">
        <div className="w-full">
          <GreetingHeader userName="Alison" />
          <div className="mt-6 flex justify-center">
            <AppImage
              imageName="image1.jpg"
              alt="Profile"
              width={160}
              height={160}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
