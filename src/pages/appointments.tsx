import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Sidebar } from "@/components/layout/Sidebar";
import { GreetingHeader } from "@/components/layout/GreetingHeader";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Input } from "@/components/ui/Input";
import { DataTable } from "@/components/table/DataTable";
import { EyeIcon } from "@/components/ui/EyeIcon";
import { Column } from "@/components/table/types";

import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/utils";

type Appointment = {
  id: string;
  customerName: string;
  service: string;
  dateTime: string;
  professional: string;
  status: "pending" | "completed" | "cancelled";
};

const mockAppointments: Appointment[] = [
  {
    id: "1",
    customerName: "Eleanor",
    service: "Nail, Facial",
    dateTime: "12 November, 09:00 AM",
    professional: "Salon",
    status: "pending",
  },
  {
    id: "2",
    customerName: "Jennie Whang",
    service: "Regular Haircut, Body Glowing",
    dateTime: "12 November, 09:00 AM",
    professional: "Individual Service Providers",
    status: "pending",
  },
  {
    id: "3",
    customerName: "Michael Chen",
    service: "Beard Trim, Scalp Treatment",
    dateTime: "12 November, 10:00 AM",
    professional: "Salon",
    status: "pending",
  },
  {
    id: "4",
    customerName: "Samantha Lee",
    service: "Full Body Massage, Facial Treatment",
    dateTime: "12 November, 11:00 AM",
    professional: "Individual Service Providers",
    status: "pending",
  },
  {
    id: "5",
    customerName: "David Kim",
    service: "Manicure, Pedicure",
    dateTime: "12 November, 12:00 PM",
    professional: "Individual Service Providers",
    status: "pending",
  },
  {
    id: "6",
    customerName: "Sarah Connor",
    service: "Hair Styling",
    dateTime: "10 November, 02:00 PM",
    professional: "Salon",
    status: "completed",
  },
  {
    id: "7",
    customerName: "John Doe",
    service: "Massage",
    dateTime: "11 November, 09:00 AM",
    professional: "Individual Service Providers",
    status: "cancelled",
  },
  {
    id: "8",
    customerName: "Emily Blunt",
    service: "Makeup",
    dateTime: "13 November, 01:00 PM",
    professional: "Salon",
    status: "pending",
  },
  {
    id: "9",
    customerName: "Chris Evans",
    service: "Haircut",
    dateTime: "13 November, 02:00 PM",
    professional: "Individual Service Providers",
    status: "pending",
  },
  {
    id: "10",
    customerName: "Scarlett Johansson",
    service: "Manicure",
    dateTime: "13 November, 03:00 PM",
    professional: "Salon",
    status: "pending",
  },
  {
    id: "11",
    customerName: "Robert Downey Jr.",
    service: "Facial",
    dateTime: "13 November, 04:00 PM",
    professional: "Individual Service Providers",
    status: "pending",
  },
];

export default function AppointmentsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Columns definition
  const columns: Column<Appointment>[] = [
    {
      id: "sno",
      header: "S No",
      accessor: (_, index) => (page - 1) * pageSize + index + 1,
      className: "w-16 text-center font-medium",
    },
    {
      id: "customerName",
      header: "Customer Name",
      field: "customerName",
      className: "font-medium",
    },
    {
      id: "service",
      header: "Service",
      field: "service",
    },
    {
      id: "dateTime",
      header: "Date/Time",
      field: "dateTime",
    },
    {
      id: "professional",
      header: "Professional",
      field: "professional",
    },
    {
      id: "action",
      header: "Action",
      accessor: (row) => (
        <button 
          className="hover:opacity-80 transition-opacity"
          onClick={() => router.push(`/appointment-detail?source=Appointments&status=${activeTab}`)}
        >
          <EyeIcon width={32} height={32} />
        </button>
      ),
      className: "w-20 text-center",
    },
  ];

  // Filtering Logic
  const filteredData = useMemo(() => {
    return mockAppointments.filter((item) => {
      // Filter by status
      if (item.status !== activeTab) return false;

      // Filter by search query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          item.customerName.toLowerCase().includes(q) ||
          item.service.toLowerCase().includes(q) ||
          item.professional.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activeTab, searchQuery]);

  // Pagination Logic
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startEntry = (page - 1) * pageSize + 1;
  const endEntry = Math.min(page * pageSize, totalItems);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]" suppressHydrationWarning>
      <Sidebar activeId="appointments" />
      <main className="flex-1 p-2 sm:p-6 overflow-y-auto">
        <div className="w-full flex flex-col gap-6">
          <GreetingHeader userName="Alison" />

          <div className="flex flex-col gap-4">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <h2 className="text-xl font-bold text-[#13000A]">Appointments</h2>
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
                  className="bg-white border-none shadow-sm rounded-full pl-10"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-end gap-4">
              <div className="w-full sm:w-auto">
                <SegmentedControl
                  options={[
                    { id: "pending", label: "Pending" },
                    { id: "completed", label: "Completed" },
                    { id: "cancelled", label: "Cancelled" },
                  ]}
                  value={activeTab}
                  onChange={(id) => {
                    setActiveTab(id);
                    setPage(1); // Reset page on tab change
                  }}
                  className="w-full sm:w-auto min-w-75"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Show</span>
                <Select
                  options={[
                    { label: "10", value: 10 },
                    { label: "20", value: 20 },
                    { label: "50", value: 50 },
                  ]}
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1); // Reset page on size change
                  }}
                  className="w-16 h-8 bg-white border-gray-200"
                />
                <span className="text-sm text-gray-500">entries</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <DataTable
                columns={columns}
                data={filteredData}
                page={page}
                pageSize={pageSize}
                selectable={false}
                showColumnToggle={false}
                // We handle pagination UI outside
              />
            </div>

            {totalItems > 0 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-500">
                  Showing {startEntry} to {endEntry} of {totalItems} entries
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-sm rounded-full bg-[#FF4460] text-white">
                    {page}
                  </span>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
