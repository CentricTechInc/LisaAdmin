import React from "react";
import { cn } from "@/lib/utils";
import { Column, SortState } from "./types";

type Props<T> = {
  columns: Column<T>[];
  sort: SortState | null;
  onToggleSort: (columnId: string) => void;
  onToggleVisibility: (columnId: string) => void;
};

export function TableHeader<T>({ columns, sort, onToggleSort, onToggleVisibility }: Props<T>) {
  return (
    <thead className="bg-(--color-surface)">
      <tr>
        {columns.map((col) =>
          col.visible === false ? null : (
            <th
              key={col.id}
              scope="col"
              className={cn(
                "select-none whitespace-nowrap border-b px-3 py-2 text-left text-sm font-medium text-black",
                col.sortable ? "cursor-pointer" : ""
              )}
              style={col.width ? { width: col.width } : undefined}
              aria-sort={
                sort && sort.columnId === col.id ? (sort.direction === "asc" ? "ascending" : "descending") : "none"
              }
              onClick={() => (col.sortable ? onToggleSort(col.id) : undefined)}
            >
              <span className="inline-flex items-center gap-2">
                {col.header}
                {col.sortable ? (
                  <span aria-hidden="true" className="text-xs">
                    {sort && sort.columnId === col.id ? (sort.direction === "asc" ? "▲" : "▼") : "↕"}
                  </span>
                ) : null}
              </span>
            </th>
          )
        )}
        <th className="px-3 py-2 text-right">
          <details className="relative inline-block">
            <summary className="list-none cursor-pointer text-sm">Columns ▾</summary>
            <ul className="absolute right-0 z-10 mt-2 min-w-40 rounded-sm border bg-slate-400 p-2 shadow">
              {columns.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-2 px-2 py-1">
                  <label className="text-sm">{c.header}</label>
                  <input
                    type="checkbox"
                    aria-label={`Toggle ${c.header}`}
                    checked={c.visible !== false}
                    onChange={() => onToggleVisibility(c.id)}
                  />
                </li>
              ))}
            </ul>
          </details>
        </th>
      </tr>
    </thead>
  );
}
