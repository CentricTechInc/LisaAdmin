import React from "react";
import { cn } from "@/lib/utils";

export type StatCardProps = {
  label: string;
  value: string | number;
  className?: string;
  align?: "left" | "center" | "right";
};

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  className,
  align = "left",
}) => {
  const alignClass =
    align === "center"
      ? "items-center text-center"
      : align === "right"
      ? "items-end text-right"
      : "items-start text-left";

  return (
    <div
      className={cn(
        "flex h-24 min-w-[150px] rounded-xl border border-[color-mix(in_oklab,var(--color-muted)_70%,transparent)] bg-white px-4 py-3",
        alignClass,
        className
      )}
    >
      <div className="flex flex-col justify-between gap-1">
        <span className="text-xs text-[color-mix(in_oklab,var(--color-muted-foreground)_85%,transparent)]">
          {label}
        </span>
        <span className="text-2xl font-semibold text-black">
          {value}
        </span>
      </div>
    </div>
  );
};

export default StatCard;

