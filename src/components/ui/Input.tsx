import React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  rightSlot?: React.ReactNode;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, rightSlot, ...props }, ref) => {
    return (
      <div className={cn("relative", className)}>
        <input
          ref={ref}
          className={cn(
            "h-10 w-full rounded-sm border bg-slate-400 px-3 pr-9 text-black placeholder:text-[color-mix(in_oklab,var(--color-muted-foreground)_80%,transparent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-(--color-ring)"
          )}
          {...props}
        />
        {rightSlot ? (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">{rightSlot}</div>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";

export default Input;
