import React from "react";
import { cn } from "@/lib/utils";

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, ...props }, ref) => {
    return (
      <label className={cn("flex items-center gap-3 cursor-pointer", className)}>
        <div className="relative flex items-center">
          <input
            type="checkbox"
            ref={ref}
            className="peer h-5 w-5 appearance-none rounded-md border-2 border-[#00C853] bg-transparent checked:bg-transparent focus:outline-none"
            {...props}
          />
          <svg
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#00C853] opacity-0 peer-checked:opacity-100"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        {label && (
          <span className="text-lg text-[color-mix(in_oklab,var(--color-foreground)_85%,transparent)]">
            {label}
          </span>
        )}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";

export default Checkbox;
