import React from "react";
import { Column } from "./types";
import { cn } from "@/lib/utils";

type Props<T> = {
  columns: Column<T>[];
  rows: T[];
  selectable?: boolean;
  selected: Set<number>;
  onToggleRow: (index: number, range?: boolean) => void;
  showExtraColumn?: boolean;
  expanded: Set<number>;
  onToggleExpand: (index: number) => void;
  renderSubComponent?: (row: T) => React.ReactNode;
};

export function TableBody<T>({ columns, rows, selectable, selected, onToggleRow, showExtraColumn, expanded, onToggleExpand, renderSubComponent }: Props<T>) {
  const lastSelectedRef = React.useRef<number | null>(null);

  const handleClick = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const range = (e.nativeEvent as unknown as KeyboardEvent).shiftKey && lastSelectedRef.current !== null;
    onToggleRow(i, range);
    lastSelectedRef.current = i;
  };

  return (
    <tbody>
      {rows.map((row, i) => {
        const isExpanded = expanded.has(i);
        return (
          <React.Fragment key={i}>
            <tr
              className={cn(
                "border-b bg-slate-100 hover:bg-[color-mix(in_oklab,var(--color-surface)_70%,transparent)]",
                selected.has(i) ? "outline outline-(--color-ring)" : ""
              )}
            >
              {columns.map((col) =>
                col.visible === false ? null : (
                  <td key={col.id} className={cn("px-3 py-2 text-sm text-black", col.className)}>
                    {col.accessor
                      ? col.accessor(row, i, { isExpanded, toggleExpand: () => onToggleExpand(i) })
                      : col.field
                      ? row[col.field] as React.ReactNode
                      : null}
                  </td>
                )
              )}
              {showExtraColumn ? (
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
              ) : null}
            </tr>
            {isExpanded && renderSubComponent && (
              <tr className="bg-slate-50">
                <td colSpan={columns.length + (showExtraColumn ? 1 : 0)} className="p-4">
                  {renderSubComponent(row)}
                </td>
              </tr>
            )}
          </React.Fragment>
        );
      })}
    </tbody>
  );
}
