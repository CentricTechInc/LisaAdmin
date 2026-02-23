import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import { DataTable } from "@/components/table/DataTable";
import { Column } from "@/components/table/types";
import { EyeIcon } from "@/components/ui/EyeIcon";
import api from "@/utils/axios";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";

type Customer = {
  id: number;
  user_id: number;
  picture: string;
  name: string; // business_name mapped to name
  email: string;
  age: string;
  gender: string;
  address: string; // street_address + city + country
  status: "Active" | "Block";
};

type CustomerApiItem = {
  id?: number | string;
  first_name?: string;
  last_name?: string;
  email?: string;
  age?: string | number;
  gender?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  country?: string;
  picture?: string;
  status?: "Active" | "Blocked";
};

type CustomerListingResponse = {
  status?: boolean;
  data?: {
    data?: CustomerApiItem[];
    total?: number;
  };
};

export default function CustomersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [blockingId, setBlockingId] = useState<number | null>(null);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    customerId: number | null;
    customerName: string;
    currentStatus: "Active" | "Block";
  }>({
    isOpen: false,
    customerId: null,
    customerName: "",
    currentStatus: "Active"
  });

  const fetchCustomers = useCallback(async () => {
    try {
      const response = await api.get(`/customer/salon-listing/${currentPage}?pageLimit=${pageSize}`);

      const serverResponse = response.data.data as CustomerListingResponse;

      if (serverResponse?.status && serverResponse.data?.data && Array.isArray(serverResponse.data.data)) {
        const mappedData: Customer[] = serverResponse.data.data.map((item) => {
          // Normalize status
          let status: "Active" | "Block" = "Active";
          if (item.status === "Blocked" ) {
            status = "Block";
          } else if (item.status === "Active") {
            status = "Active";
          }
          
          return {
            id: Number(item.id),
            user_id: Number(item.id),
            picture: item.picture || "/images/avatar.png",
            name: `${item.first_name || ""} ${item.last_name || ""}`.trim() || "Unknown",
            email: item.email || "N/A",
            age: item.age ? String(item.age) : "N/A",
            gender: item.gender || "N/A",
            address: [
              item.city,
              item.state,
              item.zipcode,
              item.country
            ].filter(Boolean).join(", "),
            status: status
          };
        });
        setCustomers(mappedData);
        // Try to get total count from response
        setTotalCustomers(serverResponse.data.total || 0);
      } else {
        console.warn("Unexpected API response structure:", serverResponse);
        setCustomers([]);
        setTotalCustomers(0);
      }
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Filter
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const initiateBlockToggle = useCallback((customer: Customer) => {
    setModalState({
      isOpen: true,
      customerId: customer.id,
      customerName: customer.name,
      currentStatus: customer.status ,
    });
  }, []);

  const handleBlockConfirm = async () => {
    if (!modalState.customerId) return;

    try {
      setBlockingId(modalState.customerId);
      const nextStatus = modalState.currentStatus === "Block" ? "Active" : "Block";
      console.log("Current Status:", modalState.currentStatus, "Next Status:", nextStatus);
      
      await api.put(`/admin/updateProfessionalStatus/${modalState.customerId}`, {
        status: nextStatus,
        reason: nextStatus === "Block" ? "Blocked by admin" : "Unblocked by admin"
      });

      // Refresh data from API
      await fetchCustomers();
      setModalState(prev => ({ ...prev, isOpen: false }));
    } catch (error) {
      console.error("Failed to update customer status:", error);
    } finally {
      setBlockingId(null);
    }
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
            onClick={() => router.push(`/customers/profile?user_id=${item?.user_id}`)}
            className="group flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 transition-colors hover:bg-gray-100"
            aria-label="View details"
          >
            <EyeIcon className="h-4 w-4 text-gray-500" />
          </button>
          <button
            onClick={() => initiateBlockToggle(item)}
            disabled={blockingId === item.id}
            className={cn(
              "h-8 w-24 rounded text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
              item.status === "Active"
                ? "bg-red-50 text-red-600 hover:bg-red-100"
                : "bg-green-50 text-green-600 hover:bg-green-100"
            )}
          >
            {blockingId === item.id 
              ? (item.status === "Active" ? "Blocking..." : "Unblocking...")
              : (item.status === "Active" ? "Block" : "Unblock")}
          </button>
        </div>
      ),
    },
  ], [router, blockingId, initiateBlockToggle]);

  return (
    <div className="mx-auto w-full flex flex-col gap-3">
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
              <option value={2}>2</option>
              <option value={5}>5</option>
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
            manualPagination={true}
            totalCount={totalCustomers}
          />
        </div>
      </div>

      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleBlockConfirm}
        title={modalState.currentStatus === "Active" ? "Block Customer" : "Unblock Customer"}
        message={`Are you sure you want to ${modalState.currentStatus === "Active" ? "block" : "unblock"} ${modalState.customerName}?`}
        confirmText={modalState.currentStatus === "Active" ? "Block" : "Unblock"}
        isProcessing={blockingId !== null}
        variant={modalState.currentStatus === "Active" ? "danger" : "info"}
      />
    </div>
  );
}
