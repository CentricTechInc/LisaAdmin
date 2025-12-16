import React, { useState } from "react";
import { useRouter } from "next/router";
import { Sidebar } from "@/components/layout/Sidebar";
import { GreetingHeader } from "@/components/layout/GreetingHeader";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/Input";

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

import { EyeIcon } from "@/components/ui/EyeIcon";

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

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentCustomers = filteredCustomers.slice(startIndex, startIndex + pageSize);

  const handleBlockToggle = (id: number) => {
    setCustomers(customers.map(c => 
      c.id === id ? { ...c, status: c.status === "Blocked" ? "Active" : "Blocked" } : c
    ));
  };

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]" suppressHydrationWarning>
      <Sidebar activeId="customers" />
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="mx-auto max-w-7xl flex flex-col gap-6">
          <GreetingHeader userName="Alison" />
          
          <div className="rounded-xl bg-white p-6 shadow-sm min-h-[600px]">
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
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700 font-semibold">
                  <tr>
                    <th className="px-6 py-3 cursor-pointer hover:bg-gray-100">
                      <div className="flex items-center gap-1">Name <span className="text-[10px]">↕</span></div>
                    </th>
                    <th className="px-6 py-3 cursor-pointer hover:bg-gray-100">
                      <div className="flex items-center gap-1">Email <span className="text-[10px]">↕</span></div>
                    </th>
                    <th className="px-6 py-3 cursor-pointer hover:bg-gray-100">
                      <div className="flex items-center gap-1">Age <span className="text-[10px]">↕</span></div>
                    </th>
                    <th className="px-6 py-3 cursor-pointer hover:bg-gray-100">
                      <div className="flex items-center gap-1">Gender <span className="text-[10px]">↕</span></div>
                    </th>
                    <th className="px-6 py-3 cursor-pointer hover:bg-gray-100">
                      <div className="flex items-center gap-1">Action <span className="text-[10px]">↕</span></div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {currentCustomers.length > 0 ? (
                    currentCustomers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{customer.name}</td>
                        <td className="px-6 py-4">{customer.email}</td>
                        <td className="px-6 py-4">{customer.age}</td>
                        <td className="px-6 py-4">{customer.gender}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => router.push('/customers/profile')}
                              className="group flex items-center justify-center transition-transform hover:scale-105 focus:outline-none"
                              aria-label="View details"
                            >
                              <EyeIcon className="w-9 h-9" />
                            </button>
                            <button
                              onClick={() => handleBlockToggle(customer.id)}
                              className={cn(
                                "h-8 px-4 rounded text-xs font-medium transition-colors",
                                customer.status === "Active"
                                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                                  : "bg-green-50 text-green-600 hover:bg-green-100"
                              )}
                            >
                              {customer.status === "Active" ? "Block" : "Unblock"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center">
                        No customers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(startIndex + pageSize, filteredCustomers.length)} of {filteredCustomers.length} entries
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded border border-gray-200 px-3 py-1 text-sm disabled:opacity-50 hover:bg-gray-50"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      "rounded border px-3 py-1 text-sm",
                      currentPage === page
                        ? "border-[#FF4460] bg-[#FF4460] text-white"
                        : "border-gray-200 hover:bg-gray-50"
                    )}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded border border-gray-200 px-3 py-1 text-sm disabled:opacity-50 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
