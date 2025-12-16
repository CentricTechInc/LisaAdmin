import React from "react";
import { cn } from "@/lib/utils";
import { Column, DataTableProps, SortState } from "./types";
import { TableHeader } from "./TableHeader";
import { TableBody } from "./TableBody";
import { TableSkeleton } from "./TableSkeleton";

function sortRows<T>(rows: T[], columns: Column<T>[], sort: SortState | null) {
  if (!sort) return rows;
  const col = columns.find((c) => c.id === sort.columnId);
  if (!col) return rows;
  const dir = sort.direction === "asc" ? 1 : -1;
  const copy = [...rows];
  copy.sort((a, b) => {
    const av = col.accessor ? col.accessor(a) : col.field ? a[col.field] : undefined;
    const bv = col.accessor ? col.accessor(b) : col.field ? b[col.field] : undefined;
    const ax = typeof av === "string" ? av.toLowerCase() : av;
    const bx = typeof bv === "string" ? bv.toLowerCase() : bv;
    if (ax == null && bx == null) return 0;
    if (ax == null) return -1 * dir;
    if (bx == null) return 1 * dir;
    if (ax < bx) return -1 * dir;
    if (ax > bx) return 1 * dir;
    return 0;
  });
  return copy;
}

function filterRows<T>(rows: T[], columns: Column<T>[], term?: string) {
  if (!term) return rows;
  const t = term.toLowerCase();
  return rows.filter((r) =>
    columns.some((c) => {
      if (c.visible === false) return false;
      const v = c.accessor ? c.accessor(r) : c.field ? r[c.field] : undefined;
      const s = typeof v === "string" ? v : v != null ? String(v) : "";
      return s.toLowerCase().includes(t);
    })
  );
}

export function DataTable<T>({
  columns: incomingColumns,
  data,
  selectable = true,
  initialSort = null,
  page = 1,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  globalFilter,
  loading,
  error,
  onRetry,
  showColumnToggle = true,
}: DataTableProps<T>) {
  const [columns, setColumns] = React.useState<Column<T>[]>(incomingColumns);
  const [sort, setSort] = React.useState<SortState | null>(initialSort ?? null);
  const [selected, setSelected] = React.useState<Set<number>>(new Set());

  React.useEffect(() => setColumns(incomingColumns), [incomingColumns]);

  const filtered = React.useMemo(() => filterRows<T>(data, columns, globalFilter), [data, columns, globalFilter]);
  const sorted = React.useMemo(() => sortRows<T>(filtered, columns, sort), [filtered, columns, sort]);
  const total = sorted.length;
  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  const pageRows = sorted.slice(start, end);

  const onToggleSort = (columnId: string) => {
    setSort((prev) => {
      const next =
        prev && prev.columnId === columnId
          ? { columnId, direction: prev.direction === "asc" ? ("desc" as const) : ("asc" as const) }
          : { columnId, direction: "asc" as const };
      onSortChange?.(next);
      return next;
    });
  };

  const onToggleVisibility = (columnId: string) => {
    setColumns((prev) =>
      prev.map((c) => (c.id === columnId ? { ...c, visible: c.visible === false ? true : false } : c))
    );
  };

  const onToggleRow = (index: number, range?: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (range && prev.size > 0) {
        const last = [...prev].sort((a, b) => a - b)[prev.size - 1];
        const [min, max] = [Math.min(last, index), Math.max(last, index)];
        for (let i = min; i <= max; i++) next.add(i);
        return next;
      }
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  if (loading) {
    return <TableSkeleton rows={pageSize} columns={columns.filter((c) => c.visible !== false).length} />;
  }

  if (error) {
    return (
      <div role="alert" className="rounded-sm border border-red-300 bg-red-50 p-4 text-red-800">
        {error}
        {onRetry ? (
          <button className="ml-3 underline" onClick={onRetry}>
            Retry
          </button>
        ) : null}
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="rounded-sm border bg-slate-100 p-4 text-sm text-black">
        No data to display
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-sm border bg-slate-100">
      <table role="table" className={cn("w-full text-sm")}>
        <TableHeader<T>
          columns={columns}
          sort={sort}
          onToggleSort={onToggleSort}
          onToggleVisibility={onToggleVisibility}
          showColumnToggle={showColumnToggle}
        />
        <TableBody<T>
          columns={columns}
          rows={pageRows}
          selectable={selectable}
          selected={selected}
          onToggleRow={onToggleRow}
          showExtraColumn={showColumnToggle || selectable}
        />
      </table>
    </div>
  );
}

export default DataTable;
