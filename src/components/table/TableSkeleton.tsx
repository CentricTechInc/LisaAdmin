import React from "react";
import { cn } from "@/lib/utils";

type Props = {
  rows?: number;
  columns?: number;
};

export const TableSkeleton: React.FC<Props> = ({ rows = 5, columns = 5 }) => {
  return (
    <div className="overflow-x-auto rounded-sm border">
      <table className="w-full">
        <thead>
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-3 py-2">
                <div className={cn("h-3 w-24 animate-pulse rounded bg-[color-mix(in_oklab,var(--color-muted)_60%,transparent)]")} />
              </th>
            ))}
            <th className="px-3 py-2">
              <div className="h-3 w-16 animate-pulse rounded bg-[color-mix(in_oklab,var(--color-muted)_60%,transparent)]" />
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r} className="border-b">
              {Array.from({ length: columns }).map((__, c) => (
                <td key={c} className="px-3 py-3">
                  <div className="h-4 w-28 animate-pulse rounded bg-[color-mix(in_oklab,var(--color-muted)_60%,transparent)]" />
                </td>
              ))}
              <td className="px-3 py-3">
                <div className="h-4 w-8 animate-pulse rounded bg-[color-mix(in_oklab,var(--color-muted)_60%,transparent)]" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSkeleton;
