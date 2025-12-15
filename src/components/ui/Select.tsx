import React from "react";
import { cn } from "@/lib/utils";

export type SelectOption = { label: string; value: string | number };

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  options: SelectOption[];
};

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "h-10 w-full rounded-sm border bg-slate-400 px-3 text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-(--color-ring)",
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={`${opt.value}`} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }
);
Select.displayName = "Select";

export default Select;
