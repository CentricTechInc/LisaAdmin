import React from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select, SelectOption } from "@/components/ui/Select";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { cn, debounce } from "@/lib/utils";

export type BaseLayoutProps = {
  title?: string;
  children: React.ReactNode;
  onSearch?: (term: string) => void;
  onClearSearch?: () => void;
  searchPlaceholder?: string;
  filters?: { id: string; label: string; options: SelectOption[]; value?: string | number; onChange?: (v: string) => void }[];
  page?: number;
  pageSize?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: SelectOption[];
  actions?: DropdownItem[];
  onExport?: () => void;
  onImport?: (file: File) => void;
  className?: string;
};

export const BaseLayout: React.FC<BaseLayoutProps> = ({
  title,
  children,
  onSearch,
  onClearSearch,
  searchPlaceholder = "Search",
  filters = [],
  page = 1,
  pageSize = 10,
  totalItems = 0,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [
    { label: "5", value: 5 },
    { label: "10", value: 10 },
    { label: "25", value: 25 },
    { label: "50", value: 50 },
  ],
  actions = [],
  onExport,
  onImport,
  className,
}) => {
  const [term, setTerm] = React.useState("");
  const debouncedSearch = React.useMemo(
    () =>
      onSearch
        ? debounce((...args) => {
          const value = args[0];
          if (typeof value === "string") {
            onSearch(value);
          }
        }, 300)
        : undefined,
    [onSearch]
  );

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && onImport) onImport(f);
    e.target.value = "";
  };

  return (
    <div className={cn("w-full p-6 bg-(--color-surface) text-black", className)}>
      {title ? <h1 className="mb-4 text-2xl font-semibold text-black">{title}</h1> : null}
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between w-full">

        <div className="flex items-center gap-2  w-full">
          {onExport ? (
            <Button variant="success" onClick={onExport}>
              Export CSV
            </Button>
          ) : null}
          {onImport ? (
            <label className="inline-flex h-10 cursor-pointer items-center justify-center rounded-sm  px-3 text-sm ">
              <input type="file" accept=".csv" className="hidden" onChange={handleFileImport} />
              Import CSV
            </label>
          ) : null}
          {actions.length ? (
            <Dropdown
              trigger={<Button variant="ghost">Options ▾</Button>}
              items={actions}
              align="right"
            />
          ) : null}
        </div>
        <div className="flex flex-col w-full items-end gap-3">
          <Input
            aria-label="Search"
            placeholder={searchPlaceholder}
            value={term}
            className="flex-1"
            onChange={(e) => {
              const v = e.target.value;
              setTerm(v);
              if (debouncedSearch) debouncedSearch(v);
            }}
            rightSlot={
              <button
                aria-label="Clear search"
                className="rounded-sm px-1 text-xs text-black hover:text-black w-full"
                onClick={() => {
                  setTerm("");
                  onClearSearch?.();
                }}
              >
                ×
              </button>
            }
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-black">Show</span>
            <Select
              aria-label="Page size"
              value={pageSize}
              onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
              options={pageSizeOptions}
              className="w-full text-black"
            />
            <span className="text-sm text-black">entries</span>
          </div>
          {/* {filters.map((f) => (
            <Select
              key={f.id}
              aria-label={f.label}
              value={f.value as string | number}
              onChange={(e) => f.onChange?.(e.target.value)}
              options={f.options}
              className="w-40"
            />
          ))} */}
        </div>
      </div>

      <div>{children}</div>

      <div className="mt-4 flex flex-col items-center justify-between gap-3 md:flex-row">
        <div className="text-sm text-black">
          Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalItems)} of {totalItems} entries
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => onPageChange?.(Math.max(1, page - 1))}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <span className="rounded-sm bg-(--color-secondary) px-3 py-2 text-sm">
            {page}
          </span>
          <Button
            variant="secondary"
            onClick={() => onPageChange?.(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>

      </div>
    </div>
  );
};

export default BaseLayout;
