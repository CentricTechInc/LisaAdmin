import React from "react";
import { cn } from "@/lib/utils";

export type DaySelectorProps = {
  selectedDays?: string[];
  onChange?: (days: string[]) => void;
  className?: string;
};

const DAYS = [
  { id: "mon", label: "Mon" },
  { id: "tue", label: "Tue" },
  { id: "wed", label: "Wed" },
  { id: "thu", label: "Thu" },
  { id: "fri", label: "Fri" },
  { id: "sat", label: "Sat" },
  { id: "sun", label: "Sun" },
];

export const DaySelector: React.FC<DaySelectorProps> = ({
  selectedDays = [],
  onChange,
  className,
}) => {
  const toggleDay = (dayId: string) => {
    if (!onChange) return;
    if (selectedDays.includes(dayId)) {
      onChange(selectedDays.filter((d) => d !== dayId));
    } else {
      onChange([...selectedDays, dayId]);
    }
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {DAYS.map((day) => {
        const isSelected = selectedDays.includes(day.id);
        return (
          <button
            key={day.id}
            type="button"
            onClick={() => toggleDay(day.id)}
            className={cn(
              "flex h-12 w-16 items-center justify-center rounded-xl border text-sm font-medium transition-colors",
              isSelected
                ? "border-[#FF4460] bg-[#FFE4E6] text-[#FF4460]"
                : "border-[color-mix(in_oklab,var(--color-muted)_60%,transparent)] bg-[#F9FAFB] text-[color-mix(in_oklab,var(--color-muted-foreground)_85%,transparent)] hover:bg-[color-mix(in_oklab,var(--color-muted)_30%,transparent)]"
            )}
          >
            {day.label}
          </button>
        );
      })}
    </div>
  );
};

export default DaySelector;
