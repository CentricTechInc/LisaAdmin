import React from "react";
import { cn } from "@/lib/utils";

export type DropdownItem = {
  id: string;
  label: string;
  onSelect: () => void;
};

export type DropdownProps = {
  trigger: React.ReactNode;
  items: DropdownItem[];
  className?: string;
  align?: "left" | "right";
};

export const Dropdown: React.FC<DropdownProps> = ({ trigger, items, className, align = "left" }) => {
  return (
    <details className={cn("relative inline-block", className)}>
      <summary
        className="list-none cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-(--color-ring) rounded-sm"
        aria-haspopup="menu"
      >
        {trigger}
      </summary>
      <ul
        role="menu"
        className={cn(
          "absolute z-20 mt-2 min-w-40 rounded-sm border bg-white p-1 shadow-md",
          align === "right" ? "right-0" : "left-0"
        )}
      >
        {items.map((item) => (
          <li key={item.id} role="none">
            <button
              role="menuitem"
              className="w-full rounded-sm px-3 py-2 text-left text-black hover:bg-[color-mix(in_oklab,var(--color-muted)_65%,transparent)]"
              onClick={item.onSelect}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </details>
  );
};

export default Dropdown;
