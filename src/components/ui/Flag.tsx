import React from "react";
import * as Flags from "country-flag-icons/react/3x2";
import { cn } from "@/lib/utils";

type FlagProps = {
  countryCode: string;
  className?: string;
};

export const Flag: React.FC<FlagProps> = ({ countryCode, className }) => {
  const FlagComponent = Flags[countryCode.toUpperCase() as keyof typeof Flags];

  if (!FlagComponent) {
    return (
      <span
        className={cn(
          "flex items-center justify-center bg-gray-100 text-xs font-medium text-gray-500",
          className
        )}
        style={{ aspectRatio: "3/2" }}
      >
        {countryCode}
      </span>
    );
  }

  return (
    <FlagComponent
      title={countryCode}
      className={cn("block", className)}
    />
  );
};
