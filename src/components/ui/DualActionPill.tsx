import React from "react";
import { cn } from "@/lib/utils";

export type DualActionPillProps = {
  leftLabel: string;
  rightLabel: string;
  active?: "left" | "right";
  onLeftClick?: () => void;
  onRightClick?: () => void;
  className?: string;
};

export const DualActionPill: React.FC<DualActionPillProps> = ({
  leftLabel,
  rightLabel,
  active = "right",
  onLeftClick,
  onRightClick,
  className,
}) => {
  const baseButton =
    "flex-1 px-6 py-2 text-sm transition-colors flex items-center justify-center rounded-full";
  const inactiveClasses =
    "bg-transparent text-[color-mix(in_oklab,var(--color-muted-foreground)_85%,transparent)] hover:bg-[color-mix(in_oklab,var(--color-muted)_65%,transparent)]";
  const activeClasses = "bg-[#FF4460] font-semibold text-white";

  return (
    <div
      className={cn(
        "inline-flex items-stretch rounded-full border border-[color-mix(in_oklab,var(--color-muted)_70%,transparent)] bg-white overflow-hidden",
        className
      )}
    >
      <button
        type="button"
        onClick={onLeftClick}
        className={cn(
          baseButton,
          active === "left" ? activeClasses : inactiveClasses
        )}
      >
        {leftLabel}
      </button>
      <button
        type="button"
        onClick={onRightClick}
        className={cn(
          baseButton,
          "border-l border-[color-mix(in_oklab,var(--color-muted)_70%,transparent)]",
          active === "right" ? activeClasses : inactiveClasses
        )}
      >
        {rightLabel}
      </button>
    </div>
  );
};

export default DualActionPill;

