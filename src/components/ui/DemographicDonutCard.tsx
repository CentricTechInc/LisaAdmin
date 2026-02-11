import React from "react";
import dynamic from "next/dynamic";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";
import { cn } from "@/lib/utils";

ChartJS.register(ArcElement, Tooltip, Legend);

const Doughnut = dynamic(
  () => import("react-chartjs-2").then((m) => m.Doughnut),
  { ssr: false }
);

export type DemographicSegment = {
  id: string;
  label: string;
  value: number;
  color: string;
  backgroundColor?: string;
};

export type DemographicDonutCardProps = {
  title: string;
  totalLabel: string;
  totalValue: number;
  segments: DemographicSegment[];
  className?: string;
};

export const DemographicDonutCard: React.FC<DemographicDonutCardProps> = ({
  title,
  totalLabel,
  totalValue,
  segments,
  className,
}) => {
  const data: ChartData<"doughnut"> = {
    labels: segments.map((s) => s.label),
    datasets: [
      {
        data: segments.map((s) => s.value),
        backgroundColor: segments.map((s) => s.color),
        borderWidth: 0,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label(context) {
            const label = context.label ?? "";
            const value =
              typeof context.raw === "number"
                ? context.raw
                : Number(context.raw ?? 0);
            return `${value}`;
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
      <div className="text-sm font-semibold text-black">
        {title}
      </div>

      <div className="mt-2 flex justify-center">
        <div className="h-40 w-40">
          <Doughnut data={data} options={options} />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-black">
            {totalValue}
          </span>
          <span className="text-xs text-[color-mix(in_oklab,var(--color-muted-foreground)_85%,transparent)]">
            {totalLabel}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-4 text-xs">
          {segments.map((s) => (
            <div key={s.id} className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-sm"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-[color-mix(in_oklab,var(--color-muted-foreground)_85%,transparent)]">
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DemographicDonutCard;
