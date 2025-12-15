import { BaseLayout } from "@/layouts/BaseLayout";
import { DataTable } from "@/components/table/DataTable";
import type { Column } from "@/components/table/types";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

type Professional = {
  name: string;
  email: string;
  phone: string;
  category: string;
};

const columns: Column<Professional>[] = [
  { id: "name", header: "Name", field: "name", sortable: true },
  { id: "email", header: "Email", field: "email", sortable: true, width: 240 },
  { id: "phone", header: "Phone", field: "phone", sortable: true },
  { id: "category", header: "Category", field: "category", sortable: true },
  { id: "action", header: "Action", accessor: () => <Button variant="secondary">View</Button>, width: 120 },
];

const data: Professional[] = [
  { name: "Alison Williams", email: "alisonwilliams@mail.com", phone: "(631) 273-2740", category: "Individual Service Providers" },
  { name: "Meet Alex", email: "m.alex@mail.com", phone: "(631) 273-2740", category: "Salons" },
  { name: "Emily Johnson", email: "emily@email.com", phone: "(631) 273-2740", category: "Salons" },
];

export default function Home() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useState("");

  return (
    <div className="mx-auto max-w-6xl py-8">
      <BaseLayout
        title="Professionals"
        page={page}
        pageSize={pageSize}
        totalItems={data.length}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onSearch={setFilter}
        onClearSearch={() => setFilter("")}
        actions={[
          { id: "sort-name", label: "Sort by Name", onSelect: () => {} },
          { id: "sort-category", label: "Sort by Category", onSelect: () => {} },
        ]}
        filters={[
          {
            id: "category",
            label: "Category",
            options: [
              { label: "All", value: "" },
              { label: "Salons", value: "Salons" },
              { label: "Individual", value: "Individual Service Providers" },
            ],
            value: "",
            onChange: () => {},
          },
        ]}
      >
        <DataTable<Professional> columns={columns} data={data} page={page} pageSize={pageSize} globalFilter={filter} />
      </BaseLayout>
    </div>
  );
}
