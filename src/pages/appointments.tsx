import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Input } from "@/components/ui/Input";
import { DataTable } from "@/components/table/DataTable";
import { EyeIcon } from "@/components/ui/EyeIcon";
import { Column } from "@/components/table/types";
import api from "@/utils/axios";

import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/utils";

type Appointment = {
  id: string;
  userId: string;
  customerName: string;
  service: string;
  dateTime: string;
  professional: string;
  status: "Pending" | "Previous" | "Rejected";
};

type ApiAppointment = {
    id: number;
    user_id?: number; // Added to capture customer id if available
    customer_id?: number; // Alternative common name
    salon_id: number;
    customer_name: string;
    services: string;
    date_time: string;
    professional: string;
};

type AppointmentListingResponse = {
    data: {
        rows: ApiAppointment[];
        count: number;
    };
};

export default function AppointmentsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchAppointments = useCallback(async () => {
    try {
        setLoading(true);
        // API endpoint: /api/appointment/listing/{page}?status={status}
        // Map UI tabs to API statuses (Pending -> Upcoming, Cancelled -> Canceled)
        const apiStatus =
          activeTab === "Pending"
            ? "Upcoming"
            : activeTab === "Cancelled"
            ? "Canceled"
            : activeTab;

        const response = await api.get(`/admin/getAllAppointments`, {
            params: {
                page: page,
                status: apiStatus,
                limit: pageSize, // Assuming API supports limit, if not it might be ignored
                search: searchQuery // Assuming API supports search
            }
        });

        const serverResponse = response.data.data as AppointmentListingResponse;
        
        if (serverResponse?.data?.rows && Array.isArray(serverResponse.data.rows)) {
            const mappedData: Appointment[] = serverResponse.data.rows.map((item) => ({
                id: String(item.id),
                userId: String(item.user_id || item.customer_id || "0"),
                customerName: item.customer_name || "Unknown",
                service: item.services || "Unknown Service",
                dateTime: item.date_time,
                professional: item.professional || "Salon",
                status: activeTab as any
            }));
            
            setAppointments(mappedData);
            setTotalItems(serverResponse.data.count || 0);
        } else {
            setAppointments([]);
            setTotalItems(0);
        }
    } catch (error) {
        console.error("Failed to fetch appointments:", error);
        setAppointments([]);
        setTotalItems(0);
    } finally {
        setLoading(false);
    }
  }, [page, pageSize, activeTab, searchQuery]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);


  // Columns definition
  const columns: Column<Appointment>[] = [
    {
      id: "sno",
      header: "S No",
      accessor: (_, index) => (page - 1) * pageSize + index + 1,
      className: "w-16 text-center font-medium",
      sortable: true,
    },
    {
      id: "customerName",
      header: "Customer Name",
      field: "customerName",
      className: "font-medium",
      sortable: true,
    },
    {
      id: "service",
      header: "Service",
      field: "service",
      sortable: true,
    },
    {
      id: "dateTime",
      header: "Date/Time",
      field: "dateTime",
      sortable: true,
    },
    {
      id: "professional",
      header: "Professional",
      field: "professional",
      sortable: true,
    },
    {
      id: "action",
      header: "Action",
      accessor: (row) => (
        <button
          className="hover:opacity-80 transition-opacity"
          onClick={() => router.push(`/appointment-detail?source=customers&id=${row.id}&user_id=${row.userId}`)}
        >
          <EyeIcon width={32} height={32} />
        </button>
      ),
      className: "w-20 text-center",
      sortable: true,
    },
  ];

  // Filtering Logic (Client-side filtering removed as we use API)
  // But we still need to filter if API doesn't support search/filter properly, 
  // however, for pagination to work correctly, filtering MUST happen on server.
  // We will assume server handles it.
  
  // Pagination Logic
  // const totalItems = filteredData.length; // Now from state
  // const totalPages = Math.ceil(totalItems / pageSize);
  // const startEntry = (page - 1) * pageSize + 1;
  // const endEntry = Math.min(page * pageSize, totalItems);

  // const handlePageChange = (newPage: number) => {
  //   if (newPage >= 1 && newPage <= totalPages) {
  //     setPage(newPage);
  //   }
  // };

  return (
    <div className="w-full flex flex-col gap-6">
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
                    { id: "Pending", label: "Pending" },
                    { id: "Previous", label: "Completed" },
                    { id: "Canceled", label: "Rejected" },
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

            <div className="bg-white rounded-lg p-6  shadow-sm border border-gray-100 overflow-hidden">
              <DataTable
                columns={columns}
                data={appointments}
                page={page}
                pageSize={pageSize}
                onPageChange={setPage}
                selectable={false}
                showColumnToggle={false}
                manualPagination={true}
                totalCount={totalItems}
              />
        </div>
      </div>
    </div>
  );
}
