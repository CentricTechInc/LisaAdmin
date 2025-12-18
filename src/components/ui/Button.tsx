import React from "react";
import { cn } from "@/lib/utils";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "success" | "danger" | "brand" | "outline-brand";
  size?: "sm" | "md" | "lg";
  shape?: "default" | "pill" | "square";
  isLoading?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", shape = "default", isLoading, disabled, children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] disabled:opacity-50 disabled:cursor-not-allowed";
    
    const sizes = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
    }[size];

    const shapes = {
      default: "rounded-[var(--radius-sm)]",
      pill: "rounded-full",
      square: "rounded-none",
    }[shape];

    const variants = {
      primary:
        "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[color-mix(in_oklab,var(--color-primary)_85%,black)]",
      secondary:
        "bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)] hover:bg-[color-mix(in_oklab,var(--color-secondary)_85%,black)] border",
      ghost:
        "bg-transparent text-[var(--color-foreground)] hover:bg-[color-mix(in_oklab,var(--color-muted)_70%,transparent)]",
      success:
        "bg-[var(--color-success)] text-white hover:bg-[color-mix(in_oklab,var(--color-success)_85%,black)]",
      danger:
        "bg-[var(--color-danger)] text-white hover:bg-[color-mix(in_oklab,var(--color-danger)_85%,black)]",
      brand:
        "bg-[#FF4460] text-white hover:bg-[#E03350]",
      "outline-brand":
        "bg-transparent border border-[#FF4460] text-[#FF4460] hover:bg-red-50",
    }[variant];

    return (
      <button
        ref={ref}
        className={cn(base, sizes, shapes, variants, className)}
        aria-busy={isLoading || undefined}
        disabled={disabled || isLoading}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export default Button;
