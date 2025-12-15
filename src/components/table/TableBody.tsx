import React from "react";
import { Column } from "./types";
import { cn } from "@/lib/utils";

type Props<T> = {
  columns: Column<T>[];
  rows: T[];
  selectable?: boolean;
  selected: Set<number>;
  onToggleRow: (index: number, range?: boolean) => void;
};

export function TableBody<T>({ columns, rows, selectable, selected, onToggleRow }: Props<T>) {
  const lastSelectedRef = React.useRef<number | null>(null);

  const handleClick = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const range = (e.nativeEvent as unknown as KeyboardEvent).shiftKey && lastSelectedRef.current !== null;
    onToggleRow(i, range);
    lastSelectedRef.current = i;
  };

  return (
    <tbody>
      {rows.map((row, i) => (
        <tr
          key={i}
          className={cn(
            "border-b bg-slate-400 hover:bg-[color-mix(in_oklab,var(--color-surface)_70%,transparent)]",
            selected.has(i) ? "outline outline-(--color-ring)" : ""
          )}
        >
          {columns.map((col) =>
            col.visible === false ? null : (
              <td key={col.id} className="px-3 py-2 text-sm text-black">
                {col.accessor
                  ? col.accessor(row)
                  : col.field
                  ? row[col.field] as React.ReactNode
                  : null}
              </td>
            )
          )}
          <td className="px-3 py-2 text-right">
            {selectable ? (
              <input
                type="checkbox"
                aria-label={`Select row ${i + 1}`}
                checked={selected.has(i)}
                onChange={(e) => handleClick(i, e)}
              />
            ) : null}
          </td>
        </tr>
      ))}
    </tbody>
  );
}
