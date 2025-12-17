import React, { useState } from "react";
import { useRouter } from "next/router";
import { Sidebar } from "@/components/layout/Sidebar";
import { GreetingHeader } from "@/components/layout/GreetingHeader";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { EyeIcon } from "@/components/ui/EyeIcon";
import { TrashIcon } from "@/components/ui/TrashIcon";
import { Input } from "@/components/ui/Input";
import { SegmentedControl } from "@/components/ui/SegmentedControl";

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

  // Pagination
  const totalPages = Math.ceil(filteredProfessionals.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentProfessionals = filteredProfessionals.slice(startIndex, startIndex + pageSize);

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

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]" suppressHydrationWarning>
      <Sidebar activeId="professionals" />
      <main className="flex-1 p-2 overflow-y-auto">
        <div className="mx-auto w-full flex flex-col gap-2">
          <GreetingHeader userName="Alison" />
          
          <div className="rounded-xl bg-white p-6 shadow-sm min-h-[600px]">
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
                      <div className="flex items-center gap-1">Phone <span className="text-[10px]">↕</span></div>
                    </th>
                    <th className="px-6 py-3 cursor-pointer hover:bg-gray-100">
                      <div className="flex items-center gap-1">Category <span className="text-[10px]">↕</span></div>
                    </th>
                    <th className="px-6 py-3 cursor-pointer hover:bg-gray-100">
                      <div className="flex items-center gap-1">Status <span className="text-[10px]">↕</span></div>
                    </th>
                    <th className="px-6 py-3 cursor-pointer hover:bg-gray-100">
                      <div className="flex items-center gap-1">Action <span className="text-[10px]">↕</span></div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {currentProfessionals.length > 0 ? (
                    currentProfessionals.map((professional) => (
                      <tr key={professional.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{professional.name}</td>
                        <td className="px-6 py-4">{professional.email}</td>
                        <td className="px-6 py-4">{professional.phone}</td>
                        <td className="px-6 py-4">{professional.category}</td>
                        <td className="px-6 py-4">
                            <span className={cn(
                                "px-3 py-1 rounded-md text-xs font-semibold",
                                professional.status === "Rejected" ? "bg-[#FFEAEA] text-[#FF4460]" :
                                professional.status === "Blocked" ? "bg-gray-100 text-gray-600" :
                                professional.status === "Pending" ? "bg-yellow-100 text-yellow-600" :
                                "hidden" // Active doesn't show badge in mockup for approved tab, but let's see. Mockup for "Approved" tab isn't shown, but usually active doesn't need a badge or maybe green.
                            )}>
                                {professional.status === "Active" ? "" : professional.status}
                            </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => router.push({ 
                                pathname: '/professionals/profile', 
                                query: professional.status === 'Pending' ? { status: 'pending' } : 
                                       professional.status === 'Rejected' ? { status: 'rejected' } : {} 
                              })}
                              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-500"
                              aria-label="View details"
                            >
                              <EyeIcon className="w-5 h-5" />
                            </button>
                            {activeTab === "Approved" && (
                              <>
                                <button
                                  onClick={() => handleBlockToggle(professional.id)}
                                  className={cn(
                                    "h-8 px-4 rounded text-xs font-medium transition-colors min-w-[70px]",
                                    professional.status === "Active"
                                      ? "bg-red-50 text-red-600 hover:bg-red-100"
                                      : "bg-green-50 text-green-600 hover:bg-green-100"
                                  )}
                                >
                                  {professional.status === "Active" ? "Block" : "Unblock"}
                                </button>
                                <button
                                    onClick={() => handleDelete(professional.id)}
                                    className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-50 text-red-400 hover:text-red-600"
                                    aria-label="Delete"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                              </>
                            )}
                            {activeTab === "Rejected / Block" && (
                                <button
                                    onClick={() => handleDelete(professional.id)}
                                    className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-50 text-red-400 hover:text-red-600"
                                    aria-label="Delete"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center">
                        No professionals found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(startIndex + pageSize, filteredProfessionals.length)} of {filteredProfessionals.length} entries
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
