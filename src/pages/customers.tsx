import React, { useState, useMemo } from "react";
import { useRouter } from "next/router";
import { Sidebar } from "@/components/layout/Sidebar";
import { GreetingHeader } from "@/components/layout/GreetingHeader";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import { DataTable } from "@/components/table/DataTable";
import { Column } from "@/components/table/types";
import { EyeIcon } from "@/components/ui/EyeIcon";

type Customer = {
  id: number;
  name: string;
  email: string;
  age: number;
  gender: "Male" | "Female";
  status: "Active" | "Blocked";
};

const initialCustomers: Customer[] = [
  { id: 1, name: "Eleanor", email: "eleanor@mail.com", age: 25, gender: "Male", status: "Active" },
  { id: 2, name: "Meet Alex", email: "m.alex@mail.com", age: 19, gender: "Female", status: "Blocked" },
  { id: 3, name: "Emily Johnson", email: "emily@mail.com", age: 32, gender: "Female", status: "Active" },
  { id: 4, name: "Michael Brown", email: "michael@mail.com", age: 45, gender: "Male", status: "Active" },
  { id: 5, name: "Sarah Wilson", email: "sarah@mail.com", age: 28, gender: "Female", status: "Active" },
  { id: 6, name: "David Miller", email: "david@mail.com", age: 35, gender: "Male", status: "Blocked" },
  { id: 7, name: "Jessica Taylor", email: "jessica@mail.com", age: 22, gender: "Female", status: "Active" },
  { id: 8, name: "James Anderson", email: "james@mail.com", age: 40, gender: "Male", status: "Active" },
  { id: 9, name: "Laura Martinez", email: "laura@mail.com", age: 31, gender: "Female", status: "Blocked" },
  { id: 10, name: "Robert Thomas", email: "robert@mail.com", age: 50, gender: "Male", status: "Active" },
  { id: 11, name: "Jennifer Garcia", email: "jennifer@mail.com", age: 27, gender: "Female", status: "Active" },
];

export default function CustomersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);

  // Filter
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBlockToggle = (id: number) => {
    setCustomers(customers.map(c => 
      c.id === id ? { ...c, status: c.status === "Blocked" ? "Active" : "Blocked" } : c
    ));
  };

  const columns: Column<Customer>[] = useMemo(() => [
    { id: "name", header: "Name", field: "name", sortable: true },
    { id: "email", header: "Email", field: "email", sortable: true },
    { id: "age", header: "Age", field: "age", sortable: true },
    { id: "gender", header: "Gender", field: "gender", sortable: true },
    {
      id: "action",
      header: "Action",
      accessor: (item) => (
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push('/customers/profile')}
            className="group flex items-center justify-center transition-transform hover:scale-105 focus:outline-none"
            aria-label="View details"
          >
            <EyeIcon className="w-9 h-9" />
          </button>
          <button
            onClick={() => handleBlockToggle(item.id)}
            className={cn(
              "h-8 px-4 rounded text-xs font-medium transition-colors",
              item.status === "Active"
                ? "bg-red-50 text-red-600 hover:bg-red-100"
                : "bg-green-50 text-green-600 hover:bg-green-100"
            )}
          >
            {item.status === "Active" ? "Block" : "Unblock"}
          </button>
        </div>
      ),
    },
  ], [router]);

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]" suppressHydrationWarning>
      <Sidebar activeId="customers" />
      <main className="flex-1 p-2 overflow-y-auto">
        <div className="mx-auto w-full flex flex-col gap-3">
          <GreetingHeader userName="Alison" />
          
          <div className="rounded-xl bg-white p-6 shadow-sm min-h-150">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Customers</h2>
              <div className="w-full sm:w-64">
                <Input
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-lg border-gray-200 bg-white focus-visible:ring-black focus-visible:border-black"
                  leftSlot={
                    <Image
                      src="/icons/search-normal.svg"
                      alt="Search"
                      width={20}
                      height={20}
                      className="text-gray-400"
                    />
                  }
                />
              </div>
            </div>

            {/* Show Entries */}
            <div className="mb-4 flex justify-end">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Show</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="rounded border border-gray-200 bg-white px-2 py-1 outline-none focus:border-black"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span>entries</span>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-lg border p-6  border-gray-200 overflow-hidden">
              <DataTable
                columns={columns}
                data={filteredCustomers}
                page={currentPage}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                selectable={false}
                showColumnToggle={false}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
