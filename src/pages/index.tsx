import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  React.useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated) {
      router.push("/dashboard");
      return;
    }

    // Redirect to login after 3 seconds if not authenticated
    const timer = setTimeout(() => {
      router.push("/auth/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router, isLoading, isAuthenticated]);

  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-linear-to-br from-white via-gray-50 to-gray-200">
      {/* Top Left Decorative Pink Circle/Glow */}
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#FF4460] opacity-40 blur-[80px]" />
      
      {/* Secondary glow for depth */}
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#FF4460] opacity-30 blur-[60px]" />

      {/* Logo */}
      <div className="relative z-10 h-24 w-64 animate-fade-in">
        <Image
          src="/icons/Lisa.svg"
          alt="Lisa Logo"
          fill
          className="object-contain"
          style={{
            // Filter to convert white/black logo to Brand Pink (#FF4460)
            filter: "brightness(0) saturate(100%) invert(38%) sepia(54%) saturate(3028%) hue-rotate(324deg) brightness(101%) contrast(101%)"
          }}
          priority
        />
      </div>
    </div>
  );
}
