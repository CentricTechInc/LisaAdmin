import { render, screen, fireEvent } from "@testing-library/react";
import { DataTable } from "@/components/table/DataTable";
import type { Column } from "@/components/table/types";
import { describe, it, expect, vi } from "vitest";

type Row = { name: string; email: string; phone: string; category: string };

const columns: Column<Row>[] = [
  { id: "name", header: "Name", field: "name", sortable: true },
  { id: "email", header: "Email", field: "email", sortable: true },
  { id: "phone", header: "Phone", field: "phone" },
  { id: "category", header: "Category", field: "category", sortable: true },
];

const data: Row[] = [
  { name: "B", email: "b@mail.com", phone: "1", category: "X" },
  { name: "A", email: "a@mail.com", phone: "2", category: "Y" },
];

describe("DataTable", () => {
  it("renders rows", () => {
    render(<DataTable<Row> columns={columns} data={data} page={1} pageSize={10} />);
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("sorts by header click", () => {
    const onSortChange = vi.fn();
    render(<DataTable<Row> columns={columns} data={data} page={1} pageSize={10} onSortChange={onSortChange} />);
    fireEvent.click(screen.getByText("Name"));
    expect(onSortChange).toHaveBeenCalled();
  });

  it("filters with global term", () => {
    render(<DataTable<Row> columns={columns} data={data} page={1} pageSize={10} globalFilter={"a"} />);
    expect(screen.queryByText("B")).not.toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
  });
});
