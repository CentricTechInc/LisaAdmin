import React from "react";
import { cn } from "@/lib/utils";

export type SegmentedOption = {
  id: string;
  label: string;
};

export type SegmentedControlProps = {
  options: SegmentedOption[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
};

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  value,
  onChange,
  className,
}) => {
  return (
    <div
      className={cn(
        "inline-flex w-full  items-center gap-1 rounded-full border border-[color-mix(in_oklab,var(--color-muted)_70%,transparent)] bg-white p-1",
        className
      )}
    >
      {options.map((opt) => {
        const isActive = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={cn(
              "flex-1 rounded-full px-4 py-2 text-sm transition-colors",
              isActive
                ? "bg-[#FF4460] font-semibold text-white"
                : "text-[color-mix(in_oklab,var(--color-muted-foreground)_85%,transparent)] hover:bg-[color-mix(in_oklab,var(--color-muted)_70%,transparent)]"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};

export default SegmentedControl;

