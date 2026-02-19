import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { EyeIcon } from "@/components/ui/EyeIcon";
import { TrashIcon } from "@/components/ui/TrashIcon";
import { Input } from "@/components/ui/Input";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { DataTable } from "@/components/table/DataTable";
import { Column } from "@/components/table/types";
import api from "@/utils/axios";
import Modal from "@/components/ui/Modal";

type Professional = {
  id: number;
  user_id: number;
  name: string;
  email: string;
  phone: string;
  category: string;
  status: "Active" | "Blocked" | "Rejected" | "Pending";
};

export default function ProfessionalsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [activeTab, setActiveTab] = useState("Approved");
  
  // Delete Modal State
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Block Modal State
  const [blockId, setBlockId] = useState<number | null>(null);
  const [blockStatus, setBlockStatus] = useState<"Block" | "Active" | null>(null);
  const [isBlocking, setIsBlocking] = useState(false);
  const [blockReason, setBlockReason] = useState("");
  const [blockError, setBlockError] = useState<string | null>(null);

  const tabs = ["Approved", "Pending Requests", "Rejected / Block"];

  const fetchProfessionals = async () => {
    try {
      setLoading(true);
      
      // Map tab to status param
      let statusParam = "Approved";
      if (activeTab === "Pending Requests") statusParam = "Pending";
      if (activeTab === "Rejected / Block") statusParam = "Rejected";

      const response = await api.get('/admin/getAllProfessionals', {
        params: {
          page: currentPage,
          limit: pageSize,
          status: statusParam,
          search: searchQuery // Assuming API supports search, if not we might need to filter client side but let's pass it
        }
      });

      // Based on example.json structure
      // response.data is the ApiResponse wrapper from axios interceptor
      // response.data.data is the actual backend response body
      const backendResponse = response.data.data;
      
      if (backendResponse?.data?.items) {
         const items = backendResponse.data.items.map((item: any) => ({
            id: Number(item.id),
            user_id: Number(item.user_id ?? item.userId ?? item.id),
            name: item.name || "Unknown",
            email: item.email || "",
            phone: item.phone || "",
            category: item.category || "Salons",
            status: item.status || "Active"
         }));
         
         setProfessionals(items);
         setTotalItems(backendResponse.data.meta?.total || 0);
      } else {
         setProfessionals([]);
         setTotalItems(0);
      }
    } catch (error) {
      console.error("Failed to fetch professionals:", error);
      setProfessionals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessionals();
  }, [currentPage, pageSize, activeTab, searchQuery]);

  const handleBlockClick = useCallback((id: number, currentStatus: string) => {
    setBlockId(id);
    setBlockStatus(currentStatus === "Active" ? "Block" : "Active");
    setBlockReason("");
    setBlockError(null);
  }, []);

  const handleConfirmBlock = async () => {
    if (!blockId || !blockStatus) return;

    // Reason is mandatory for blocking
    if (blockStatus === "Block" && !blockReason.trim()) {
        setBlockError("Please provide a reason for blocking.");
        return;
    }
    
    try {
        setIsBlocking(true);
        setBlockError(null);
        
        await api.put(`/admin/updateProfessionalStatus/${blockId}`, {
            status: blockStatus,
            reason: blockReason || "Unblocked by admin"
        });

        // Refresh the list
        fetchProfessionals();
        setBlockId(null);
        setBlockStatus(null);
    } catch (error: any) {
        console.error("Failed to update professional status:", error);
        setBlockError(error?.message || "Failed to update status");
    } finally {
        setIsBlocking(false);
    }
  };

  const handleDeleteClick = useCallback((id: number) => {
    console.log("Delete clicked for ID:", id);
    setDeleteId(id);
    setDeleteError(null);
  }, []);

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    
    try {
        console.log("Attempting to delete ID:", deleteId);
        setIsDeleting(true);
        setDeleteError(null);
        await api.delete(`/admin/deleteProfessional/${deleteId}`);
        console.log("Delete successful");
        // Refresh the list
        fetchProfessionals();
        setDeleteId(null);
    } catch (error: any) {
        console.error("Failed to delete professional:", error);
        setDeleteError(error?.message || "Failed to delete professional");
    } finally {
        setIsDeleting(false);
    }
  };

  const columns: Column<Professional>[] = useMemo(() => [
    { id: "name", header: "Name", field: "name", sortable: true },
    { id: "email", header: "Email", field: "email", sortable: true },
    { id: "phone", header: "Phone", field: "phone", sortable: true },
    { id: "category", header: "Category", field: "category", sortable: true },
    {
      id: "action",
      header: "Action",
      accessor: (item) => (
        <div className="flex items-center gap-2">
            <button 
                onClick={() => router.push(
                  `/professionals/profile?id=${item.id}&user_id=${item.user_id}${
                    item.status === "Pending"
                      ? "&status=pending"
                      : item.status === "Rejected"
                      ? "&status=rejected"
                      : item.status === "Blocked"
                      ? "&status=blocked"
                      : ""
                  }`
                )}
                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-500"
                aria-label="View details"
            >
                <EyeIcon className="w-5 h-5" />
            </button>
            {activeTab === "Approved" && (
                <>
                <button
                    onClick={() => handleBlockClick(item.id, item.status)}
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
                    onClick={() => handleDeleteClick(item.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-50 text-red-400 hover:text-red-600"
                    aria-label="Delete"
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
                </>
            )}
            {activeTab === "Rejected / Block" && (
                <button
                    onClick={() => handleDeleteClick(item.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-50 text-red-400 hover:text-red-600"
                    aria-label="Delete"
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
            )}
        </div>
      ),
    },
  ], [activeTab, router, handleDeleteClick, handleBlockClick]);

  return (
    <div className="mx-auto w-full flex flex-col gap-2">
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
                        onChange={(val) => {
                            setActiveTab(val);
                            setCurrentPage(1); // Reset page on tab change
                        }}
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
                data={professionals}
                page={currentPage}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                selectable={false}
                showColumnToggle={false}
                loading={loading}
                manualPagination={true}
                totalCount={totalItems}
              />
            </div>
        </div>

        {/* Delete Confirmation Modal */}
        <Modal
            isOpen={deleteId !== null}
            onClose={() => setDeleteId(null)}
            className="max-w-md p-6 text-center"
        >
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                    <TrashIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Delete Professional?</h3>
                <p className="text-gray-500">
                    Are you sure you want to delete this professional? This action cannot be undone.
                </p>
                {deleteError && (
                    <div className="text-red-600 bg-red-50 px-3 py-2 rounded-md text-sm w-full">
                        {deleteError}
                    </div>
                )}
                <div className="flex items-center gap-3 w-full mt-4">
                    <button
                        onClick={() => setDeleteId(null)}
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50"
                        disabled={isDeleting}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirmDelete}
                        className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2"
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </Modal>

        {/* Block Confirmation Modal */}
        <Modal
            isOpen={blockId !== null}
            onClose={() => {
                setBlockId(null);
                setBlockStatus(null);
                setBlockReason("");
                setBlockError(null);
            }}
            className="max-w-md p-6 text-center"
        >
            <div className="flex flex-col items-center gap-4">
                <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center",
                    blockStatus === "Block" ? "bg-red-50 text-red-500" : "bg-green-50 text-green-500"
                )}>
                    <EyeIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                    {blockStatus === "Block" ? "Block Professional?" : "Unblock Professional?"}
                </h3>
                <p className="text-gray-500">
                    {blockStatus === "Block" 
                        ? "Are you sure you want to block this professional? They will not be able to access their account." 
                        : "Are you sure you want to unblock this professional?"}
                </p>
                
                {blockStatus === "Block" && (
                    <div className="w-full text-left">
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Reason for blocking <span className="text-red-500">*</span></label>
                        <textarea
                            value={blockReason}
                            onChange={(e) => setBlockReason(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-black focus:border-black min-h-20"
                            placeholder="Enter reason..."
                        />
                    </div>
                )}

                {blockError && (
                    <div className="text-red-600 bg-red-50 px-3 py-2 rounded-md text-sm w-full">
                        {blockError}
                    </div>
                )}

                <div className="flex items-center gap-3 w-full mt-4">
                    <button
                        onClick={() => {
                            setBlockId(null);
                            setBlockStatus(null);
                            setBlockReason("");
                            setBlockError(null);
                        }}
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50"
                        disabled={isBlocking}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirmBlock}
                        className={cn(
                            "flex-1 px-4 py-2 rounded-lg text-white font-medium disabled:opacity-50 flex items-center justify-center gap-2",
                            blockStatus === "Block" ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                        )}
                        disabled={isBlocking}
                    >
                        {isBlocking 
                            ? (blockStatus === "Block" ? "Blocking..." : "Unblocking...") 
                            : (blockStatus === "Block" ? "Block" : "Unblock")}
                    </button>
                </div>
            </div>
        </Modal>
    </div>
  );
}
