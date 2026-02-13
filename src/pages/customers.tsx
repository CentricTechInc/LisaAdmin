import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import { DataTable } from "@/components/table/DataTable";
import { Column } from "@/components/table/types";
import { EyeIcon } from "@/components/ui/EyeIcon";
import api from "@/utils/axios";

type Customer = {
  id: number;
  user_id: number;
  picture: string;
  name: string; // business_name mapped to name
  address: string; // street_address + city + country
  status: "Active" | "Blocked";
};

export default function CustomersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/customer/salon-listing/${currentPage}?pageLimit=${pageSize}`);

        const serverResponse = response.data.data as any;

        if (serverResponse?.status && serverResponse.data?.data && Array.isArray(serverResponse.data.data)) {
          const mappedData: Customer[] = serverResponse.data.data.map((item: any) => ({
            id: item.id,
            user_id: item.user_id,
            picture: item.picture || "/images/avatar.png",
            name: item.bussiness_name || "Unknown",
            address: [
              item.street_address,
              item.city,
              item.state,
              item.zipcode,
              item.country
            ].filter(Boolean).join(", "),
            status: "Active" // Default status as API doesn't provide it yet
          }));
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
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [currentPage, pageSize]);

  // Filter
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBlockToggle = (id: number) => {
    setCustomers(customers.map(c =>
      c.id === id ? { ...c, status: c.status === "Blocked" ? "Active" : "Blocked" } : c
    ));
  };

  const columns: Column<Customer>[] = useMemo(() => [
    {
      id: "picture",
      header: "Picture",
      accessor: (item) => (
        <div onClick={() => console.log(item)} className="relative h-10 w-10 overflow-hidden rounded-full">
          <img
            src={item?.picture}
            alt={item?.name}
            className="object-cover"
          />
        </div>
      ),
    },
    { id: "name", header: "Business Name", field: "name", sortable: true },
    { id: "address", header: "Address", field: "address", sortable: true },
    {
      id: "status",
      header: "Status",
      sortable: true,
      accessor: (item) => (
        <span className={cn(
          "px-3 py-1 rounded-md text-xs font-semibold",
          item.status === "Blocked" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
        )}>
          {item.status}
        </span>
      ),
    },
    {
      id: "action",
      header: "Action",
      accessor: (item) => (
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/customers/profile?user_id=${item?.user_id}`)}
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
    </div>
  );
}
