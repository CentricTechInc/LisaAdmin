import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type AuthLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  className,
}) => {
  return (
    <div className="flex min-h-screen bg-white">
      <div className="relative hidden flex-1 overflow-hidden bg-white md:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#FF9FBA_0,#FFFFFF_45%,#C0B9C8_100%)]" />
        <div className="relative flex h-full w-full items-center justify-center">
          <Image
            src="/images/login_design_people.svg"
            alt="Salon illustration"
            width={640}
            height={640}
            className="h-auto w-4/5 max-w-xl"
          />
        </div>
      </div>
      <div
        className={cn(
          "flex w-full items-center justify-center bg-[#13000A] px-6 py-10 text-white md:w-[600px] md:rounded-l-[48px] relative z-10 md:-ml-[48px]",
          className
        )}
      >
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;

