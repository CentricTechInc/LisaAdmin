import React from "react";
import { cn } from "@/lib/utils";

export type BadgeProps = {
  children: React.ReactNode;
  variant?: "success" | "danger" | "pending";
  className?: string;
};

export const Badge: React.FC<BadgeProps> = ({ children, variant = "pending", className }) => {
  const styles =
    variant === "success"
      ? "bg-[var(--color-success-ghost)] text-[var(--color-success)]"
      : variant === "danger"
      ? "bg-[var(--color-danger-ghost)] text-[var(--color-danger)]"
      : "bg-[var(--color-muted)] text-[varblack]";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-1 text-xs font-medium",
        styles,
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
