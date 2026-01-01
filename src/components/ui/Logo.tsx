import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  width?: number;
  height?: number;
};

export const Logo: React.FC<LogoProps> = ({ className, width = 96, height = 32 }) => {
  return (
    <Image
      src="/icons/Lisa.svg"
      alt="Lisa logo"
      width={width}
      height={height}
      className={cn("h-8 w-auto", className)}
      priority
    />
  );
};
