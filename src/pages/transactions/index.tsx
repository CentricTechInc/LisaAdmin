import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { Sidebar } from "@/components/layout/Sidebar";
import { GreetingHeader } from "@/components/layout/GreetingHeader";
import { Input } from "@/components/ui/Input";
import { FilterPillBar, type FilterPillItem } from "@/components/ui/FilterPillBar";
import { EyeIcon } from "@/components/ui/EyeIcon";
import { DataTable } from "@/components/table/DataTable";
import { Column } from "@/components/table/types";
import { cn } from "@/lib/utils";

type TransactionStatus = "Success" | "Failed" | "Pending";

type Transaction = {
  id: number;
  from: string;
  to: string;
  amount: string;
  dateTime: string;
  status: TransactionStatus;
};

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    from: "Eleanor",
    to: "The Hair Haven",
    amount: "$48.50",
    dateTime: "12 November, 09:00 AM",
    status: "Success",
  },
  {
    id: 2,
    from: "Emily",
    to: "Style Sanctuary",
    amount: "$72.30",
    dateTime: "12 November, 09:00 AM",
    status: "Failed",
  },
  {
    id: 3,
    from: "David",
    to: "Chic Cuts",
    amount: "$59.99",
    dateTime: "12 November, 09:00 AM",
    status: "Pending",
  },
  {
    id: 4,
    from: "Laura",
    to: "Radiant Locks",
    amount: "$39.75",
    dateTime: "12 November, 09:00 AM",
    status: "Success",
  },
  {
    id: 5,
    from: "Anna",
    to: "Glamour Grove",
    amount: "$85.00",
    dateTime: "12 November, 09:00 AM",
    status: "Success",
  },
  {
    id: 6,
    from: "Sarah",
    to: "Beauty Bliss",
    amount: "$120.00",
    dateTime: "13 November, 10:00 AM",
    status: "Success",
  },
  {
    id: 7,
    from: "Mike",
    to: "Barber Bros",
    amount: "$25.00",
    dateTime: "13 November, 11:30 AM",
    status: "Pending",
  },
  {
    id: 8,
    from: "Jessica",
    to: "Nail Nirvana",
    amount: "$45.00",
    dateTime: "13 November, 01:00 PM",
    status: "Success",
  },
  {
    id: 9,
    from: "Chris",
    to: "The Hair Haven",
    amount: "$55.00",
    dateTime: "14 November, 09:00 AM",
    status: "Failed",
  },
  {
    id: 10,
    from: "Amanda",
    to: "Style Sanctuary",
    amount: "$90.00",
    dateTime: "14 November, 02:00 PM",
    status: "Success",
  },
  {
    id: 11,
    from: "Tom",
    to: "Chic Cuts",
    amount: "$30.00",
    dateTime: "15 November, 10:00 AM",
    status: "Success",
  },
];

export default function TransactionsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Filters
  const [customerFilter, setCustomerFilter] = useState("Customers");
  const [dateFilter, setDateFilter] = useState("Weekly");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");

  // Filter logic
  const filteredData = MOCK_TRANSACTIONS.filter((item) => {
    const matchesSearch =
      item.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.to.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const filterItems: FilterPillItem[] = [
    {
      id: "customer",
      label: customerFilter,
      items: [
        { id: "customers", label: "Customers", onSelect: () => setCustomerFilter("Customers") },
        { id: "professionals", label: "Professionals", onSelect: () => setCustomerFilter("Professionals") },
      ],
    },
    {
      id: "date",
      label: dateFilter,
      items: [
        { id: "weekly", label: "Weekly", onSelect: () => setDateFilter("Weekly") },
        { id: "monthly", label: "Monthly", onSelect: () => setDateFilter("Monthly") },
        { id: "yearly", label: "Yearly", onSelect: () => setDateFilter("Yearly") },
      ],
    },
    {
      id: "category",
      label: categoryFilter,
      items: [
        { id: "all", label: "All Categories", onSelect: () => setCategoryFilter("All Categories") },
        { id: "hair", label: "Hair", onSelect: () => setCategoryFilter("Hair") },
        { id: "nails", label: "Nails", onSelect: () => setCategoryFilter("Nails") },
      ],
    },
  ];


  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case "Success":
        return (
          <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
            Success
          </span>
        );
      case "Failed":
        return (
          <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
            Failed
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
            Pending
          </span>
        );
      default:
        return null;
    }
  };

  const columns: Column<Transaction>[] = [
    {
      id: "sr_no",
      header: "Sr.",
      accessor: (_, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      id: "from",
      header: "From",
      field: "from",
    },
    {
      id: "to",
      header: "To",
      field: "to",
    },
    {
      id: "amount",
      header: "Amount",
      field: "amount",
    },
    {
      id: "dateTime",
      header: "Date/Time",
      field: "dateTime",
    },
    {
      id: "status",
      header: "Status",
      accessor: (row) => getStatusBadge(row.status),
    },
    {
      id: "action",
      header: "Action",
      accessor: (row) => (
        <div className="flex justify-center">
             <button
              onClick={() => router.push(`/transactions/detail?id=${row.id}`)}
              className="hover:opacity-80 transition-opacity"
            >
              <EyeIcon width={32} height={32} />
            </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Head>
        <title>Transactions | Lisa Admin</title>
      </Head>
      <Sidebar activeId="transactions" />
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="w-full flex flex-col gap-6">
          <GreetingHeader userName="Alison" />

          <div className="rounded-xl bg-white p-6 shadow-sm min-h-150">
            {/* Header Section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
              <h2 className="text-xl font-bold text-[#13000A]">Transactions</h2>
              <div className="w-full sm:w-72">
                <Input
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftSlot={
                    <Image
                      src="/icons/search-normal.svg"
                      alt="Search"
                      width={16}
                      height={16}
                    />
                  }
                  className="bg-white border-gray-200 rounded-full pl-10"
                />
              </div>
            </div>

            {/* Filters Row */}
            <div className="flex  p-6  flex-col sm:flex-row justify-between items-center gap-4 ">
              <div className="flex items-center gap-3">
                <FilterPillBar items={filterItems} />
              </div>

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
            <DataTable
                columns={columns}
                data={filteredData}
                pageSize={pageSize}
                page={currentPage}
                onPageChange={setCurrentPage}
                selectable={false}
                showColumnToggle={false}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
