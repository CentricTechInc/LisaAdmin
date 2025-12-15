import React from "react";
import { cn } from "@/lib/utils";
import { Dropdown, type DropdownItem } from "@/components/ui/Dropdown";

export type FilterPillItem = {
  id: string;
  label: string;
  items: DropdownItem[];
  emphasized?: boolean;
};

export type FilterPillBarProps = {
  items: FilterPillItem[];
  className?: string;
};

export const FilterPillBar: React.FC<FilterPillBarProps> = ({
  items,
  className,
}) => {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-[color-mix(in_oklab,var(--color-muted)_70%,transparent)] bg-white px-2 py-1",
        className
      )}
    >
      {items.map((item, index) => {
        const isEmphasized = item.emphasized ?? index === 0;
        return (
          <Dropdown
            key={item.id}
            items={item.items}
            trigger={
              <button
                type="button"
                className={cn(
                  "flex items-center gap-1 rounded-full px-3 py-1 text-xs sm:text-sm text-[color-mix(in_oklab,var(--color-muted-foreground)_85%,transparent)] hover:bg-[color-mix(in_oklab,var(--color-muted)_70%,transparent)]",
                  isEmphasized
                    ? "font-semibold text-[color-mix(in_oklab,var(--color-foreground)_85%,transparent)]"
                    : ""
                )}
              >
                <span>{item.label}</span>
                <span className="text-[0.6rem]">▾</span>
              </button>
            }
          />
        );
      })}
    </div>
  );
};

export default FilterPillBar;

