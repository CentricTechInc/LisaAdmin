import React, { useState, useMemo } from "react";
import { useRouter } from "next/router";
import { Sidebar } from "@/components/layout/Sidebar";
import { GreetingHeader } from "@/components/layout/GreetingHeader";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { EyeIcon } from "@/components/ui/EyeIcon";
import { TrashIcon } from "@/components/ui/TrashIcon";
import { Input } from "@/components/ui/Input";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { DataTable } from "@/components/table/DataTable";
import { Column } from "@/components/table/types";

type Professional = {
  id: number;
  name: string;
  email: string;
  phone: string;
  category: string;
  status: "Active" | "Blocked" | "Rejected" | "Pending";
};

const initialProfessionals: Professional[] = [
  { id: 1, name: "Alison Williams", email: "alisonwilliams@mail.com", phone: "(631) 273-2740", category: "Individual Service Providers", status: "Rejected" },
  { id: 2, name: "Meet Alex", email: "m.alex@mail.com", phone: "(631) 273-2740", category: "Salons", status: "Blocked" },
  { id: 3, name: "Emily Johnson", email: "emily@mail.com", phone: "(631) 273-2740", category: "Salons", status: "Blocked" },
  { id: 4, name: "Michael Brown", email: "michael@mail.com", phone: "(631) 273-2740", category: "Salons", status: "Active" },
  { id: 5, name: "Sarah Wilson", email: "sarah@mail.com", phone: "(631) 273-2740", category: "Individual Service Providers", status: "Pending" },
  { id: 6, name: "David Miller", email: "david@mail.com", phone: "(631) 273-2740", category: "Salons", status: "Pending" },
  { id: 7, name: "Jessica Taylor", email: "jessica@mail.com", phone: "(631) 273-2740", category: "Individual Service Providers", status: "Active" },
  { id: 8, name: "James Anderson", email: "james@mail.com", phone: "(631) 273-2740", category: "Salons", status: "Active" },
  { id: 9, name: "Laura Martinez", email: "laura@mail.com", phone: "(631) 273-2740", category: "Individual Service Providers", status: "Blocked" },
  { id: 10, name: "Robert Thomas", email: "robert@mail.com", phone: "(631) 273-2740", category: "Salons", status: "Active" },
  { id: 11, name: "Jennifer Garcia", email: "jennifer@mail.com", phone: "(631) 273-2740", category: "Individual Service Providers", status: "Active" },
];

export default function ProfessionalsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [professionals, setProfessionals] = useState<Professional[]>(initialProfessionals);
  const [activeTab, setActiveTab] = useState("Approved");

  const tabs = ["Approved", "Pending Requests", "Rejected / Block"];

  // Filter
  const filteredProfessionals = professionals.filter((professional) => {
    const matchesSearch = professional.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    professional.email.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === "Approved") return professional.status === "Active";
    if (activeTab === "Pending Requests") return professional.status === "Pending";
    if (activeTab === "Rejected / Block") return professional.status === "Blocked" || professional.status === "Rejected";

    return true;
  });

  const handleBlockToggle = (id: number) => {
    setProfessionals(professionals.map(p => 
      p.id === id ? { ...p, status: p.status === "Blocked" ? "Active" : "Blocked" } : p
    ));
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this professional?")) {
      setProfessionals(professionals.filter(p => p.id !== id));
    }
  };

  const columns: Column<Professional>[] = useMemo(() => [
    { id: "name", header: "Name", field: "name", sortable: true },
    { id: "email", header: "Email", field: "email", sortable: true },
    { id: "phone", header: "Phone", field: "phone", sortable: true },
    { id: "category", header: "Category", field: "category", sortable: true },
    {
      id: "status",
      header: "Status",
      sortable: true,
      accessor: (item) => (
        <span className={cn(
            "px-3 py-1 rounded-md text-xs font-semibold",
            item.status === "Rejected" ? "bg-[#FFEAEA] text-[#FF4460]" :
            item.status === "Blocked" ? "bg-gray-100 text-gray-600" :
            item.status === "Pending" ? "bg-yellow-100 text-yellow-600" :
            "hidden"
        )}>
            {item.status === "Active" ? "" : item.status}
        </span>
      ),
    },
    {
      id: "action",
      header: "Action",
      accessor: (item) => (
        <div className="flex items-center gap-2">
            <button 
                onClick={() => router.push({ 
                pathname: '/professionals/profile', 
                query: item.status === 'Pending' ? { status: 'pending' } : 
                        item.status === 'Rejected' ? { status: 'rejected' } : {} 
                })}
                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-500"
                aria-label="View details"
            >
                <EyeIcon className="w-5 h-5" />
            </button>
            {activeTab === "Approved" && (
                <>
                <button
                    onClick={() => handleBlockToggle(item.id)}
                    className={cn(
                    "h-8 px-4 rounded text-xs font-medium transition-colors min-w-17.5",
                    item.status === "Active"
                        ? "bg-red-50 text-red-600 hover:bg-red-100"
                        : "bg-green-50 text-green-600 hover:bg-green-100"
                    )}
                >
                    {item.status === "Active" ? "Block" : "Unblock"}
                </button>
                <button
                    onClick={() => handleDelete(item.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-50 text-red-400 hover:text-red-600"
                    aria-label="Delete"
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
                </>
            )}
            {activeTab === "Rejected / Block" && (
                <button
                    onClick={() => handleDelete(item.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-50 text-red-400 hover:text-red-600"
                    aria-label="Delete"
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
            )}
        </div>
      ),
    },
  ], [activeTab, router]);

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]" suppressHydrationWarning>
      <Sidebar activeId="professionals" />
      <main className="flex-1 p-2 overflow-y-auto">
        <div className="mx-auto w-full flex flex-col gap-2">
          <GreetingHeader userName="Alison" />
          
          <div className="rounded-xl bg-white p-6 shadow-sm min-h-150">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Professionals</h2>
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

            {/* Tabs & Show Entries */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <div className="w-full sm:w-auto">
                    <SegmentedControl
                        options={tabs.map((tab) => ({ id: tab, label: tab }))}
                        value={activeTab}
                        onChange={setActiveTab}
                        className="bg-gray-100/50 rounded-lg p-1 w-auto"
                    />
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
            <div className="rounded-lg p-6  border border-gray-200 overflow-hidden">
              <DataTable
                columns={columns}
                data={filteredProfessionals}
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
