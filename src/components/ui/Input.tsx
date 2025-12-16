import React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, leftSlot, rightSlot, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {leftSlot ? (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">{leftSlot}</div>
        ) : null}
        <input
          ref={ref}
          className={cn(
            "h-10 w-full rounded-sm border bg-slate-100 px-3 py-2 text-sm text-black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            leftSlot && "pl-10",
            rightSlot && "pr-10",
            className
          )}
          {...props}
        />
        {rightSlot ? (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</div>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";

export default Input;
