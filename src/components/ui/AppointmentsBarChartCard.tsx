import React from "react";
import dynamic from "next/dynamic";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";
import { cn } from "@/lib/utils";
import { Dropdown } from "@/components/ui/Dropdown";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const Bar = dynamic(() => import("react-chartjs-2").then((m) => m.Bar), {
  ssr: false,
});

export type BarSeries = {
  id: string;
  label: string;
  data: number[];
  color: string;
};

export type AppointmentsBarChartCardProps = {
  title: string;
  rangeLabel: string;
  onRangeChange?: (range: string) => void;
  labels: string[];
  series: BarSeries[];
  className?: string;
};

export const AppointmentsBarChartCard: React.FC<AppointmentsBarChartCardProps> = ({
  title,
  rangeLabel,
  onRangeChange,
  labels,
  series,
  className,
}) => {
  const data: ChartData<"bar"> = {
    labels,
    datasets: series.map((s) => ({
      label: s.label,
      data: s.data,
      backgroundColor: s.color,
      borderRadius: 8,
      barPercentage: 0.6,
      categoryPercentage: 0.6,
    })),
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label(context) {
            const label = context.dataset.label ?? "";
            const value =
              typeof context.raw === "number"
                ? context.raw
                : Number(context.raw ?? 0);
            const formatted = value >= 1000 ? `${Math.round(value / 1000)}K` : `${value}`;
            return `${label}: ${formatted}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#A0A0A0",
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "#F1F1F1",
        },
        ticks: {
          color: "#A0A0A0",
          callback(value) {
            if (typeof value === "number") {
              return value >= 1000 ? `${value / 1000}K` : value;
            }
            const num = Number(value);
            return num >= 1000 ? `${num / 1000}K` : value;
          },
        },
      },
    },
  };

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border border-[color-mix(in_oklab,var(--color-muted)_70%,transparent)] bg-white px-4 py-3",
        className
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm text-black font-semibold">
          {title}
        </div>
        <Dropdown
          align="right"
          trigger={
            <button
              type="button"
              className="flex items-center gap-1 rounded-full px-3 py-1 text-xs text-[color-mix(in_oklab,var(--color-muted-foreground)_85%,transparent)] hover:bg-[color-mix(in_oklab,var(--color-muted)_70%,transparent)]"
            >
              <span>{rangeLabel}</span>
              <span className="text-[0.6rem]">▾</span>
            </button>
          }
          items={[
            { id: "daily", label: "Daily", onSelect: () => onRangeChange?.("Daily") },
            { id: "weekly", label: "Weekly", onSelect: () => onRangeChange?.("Weekly") },
            { id: "yearly", label: "Yearly", onSelect: () => onRangeChange?.("Yearly") },
          ]}
        />
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-4 text-xs">
        {series.map((s) => (
          <div key={s.id} className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: s.color }}
            />
            <span className="text-[color-mix(in_oklab,var(--color-muted-foreground)_85%,transparent)]">
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <div className="h-64 w-full">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default AppointmentsBarChartCard;

