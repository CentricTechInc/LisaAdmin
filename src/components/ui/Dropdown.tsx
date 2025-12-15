import React, { useState, useRef, useEffect } from "react";
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

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  className,
  align = "left",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (item: DropdownItem) => {
    item.onSelect();
    setIsOpen(false);
  };

  return (
    <div
      className={cn("relative inline-block", className)}
      ref={dropdownRef}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setIsOpen(!isOpen);
          }
        }}
        className="cursor-pointer outline-none"
      >
        {trigger}
      </div>
      {isOpen && items && items.length > 0 && (
        <ul
          role="menu"
          className={cn(
            "absolute z-20 mt-2 min-w-[160px] rounded-lg border border-[color-mix(in_oklab,var(--color-muted)_70%,transparent)] bg-white p-1 shadow-lg animate-in fade-in zoom-in-95 duration-100",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          {items.map((item) => (
            <li key={item.id} role="none">
              <button
                role="menuitem"
                className="w-full rounded-md px-3 py-2 text-left text-sm text-gray-800 hover:bg-gray-100 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(item);
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
