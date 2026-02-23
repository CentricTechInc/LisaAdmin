import React, { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/Button";
import { FormInput } from "@/components/ui/FormInput";
import { DataTable } from "@/components/table/DataTable";
import { EyeIcon } from "@/components/ui/EyeIcon";
import { Column } from "@/components/table/types";
import api from "@/utils/axios";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";

// Types
type Appointment = {
    id: number;
    sNo: number;
    service: string;
    dateTime: string;
    professional: string;
    amount: string;
};

type APIAppointment = {
    id: number;
    appointment_date: string;
    appointment_time: string;
    total_price: string;
    salon: {
        bussiness_name: string;
    };
    appointmentServices: {
        service: {
            name: string;
        };
    }[];
};

type CustomerProfileData = {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    formattedAddress: string;
    age: number | string;
    gender: string;
    profileImage: string;
    status: "Active" | "Block";
};

export default function CustomerProfile() {
    const router = useRouter();
    // extracting user_id from query (passed from customers list page)
    const { user_id } = router.query;

    const [loading, setLoading] = useState(false);
    const [customer, setCustomer] = useState<CustomerProfileData | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [totalAppointments, setTotalAppointments] = useState<number>(0);
    const [isBlocking, setIsBlocking] = useState(false);
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        currentStatus: "Active" | "Block";
    }>({
        isOpen: false,
        currentStatus: "Active"
    });

    const fetchData = useCallback(async () => {
        if (!router.isReady || !user_id) return;
        try {
            setLoading(true);
            const customerResponse = await api.get(`/customer/get-customer-by-id/${user_id}`);
            const appointmentsResponse = await api.get(`/appointment/details/${user_id}?page=1`);

            const userData = customerResponse.data?.data?.data?.user || {};
            const userAddress = userData.address || {};

            const getCleanImageUrl = (url: string) => {
                if (!url) return "/images/avatar.png";
                if (url.includes("http") && url.includes("/images/http")) {
                    return url.split("/images/")[1];
                }
                return url;
            };

            const formattedAddress = [
                userAddress.street,
                userAddress.city,
                userAddress.state,
                userAddress.zipcode
            ].filter(Boolean).join(", ");

            setCustomer({
                id: userData.id,
                name: `${userData.first_name || ""} ${userData.last_name || ""}`.trim() || "Unknown",
                email: userData.email || "",
                phone: userData.phone_number || "",
                address: userAddress.street || "",
                city: userAddress.city || "",
                state: userAddress.state || "",
                zipCode: userAddress.zipcode || "",
                formattedAddress: formattedAddress,
                age: userData.age || "",
                gender: userData.gender || "",
                profileImage: getCleanImageUrl(userData.picture),
                status: userData.status || "Active"
            });
            console.log(customerResponse,"customerResponse")
            const appointmentsData = appointmentsResponse.data?.data?.data?.rows || [];
            const appointmentsCount = appointmentsResponse.data?.data?.data?.count || 0;
            setTotalAppointments(appointmentsCount);

            const formattedAppointments = appointmentsData.map((item: APIAppointment, index: number) => ({
                id: item.id,
                sNo: index + 1,
                service: item.appointmentServices?.map((s) => s.service.name).join(", ") || "Unknown Service",
                dateTime: `${item.appointment_date} ${item.appointment_time}`,
                professional: item.salon?.bussiness_name || "Unknown",
                amount: `$${item.total_price}`
            }));

            setAppointments(formattedAppointments);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    }, [router.isReady, user_id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const initiateBlockToggle = () => {
        if (!customer) return;
        setModalState({
            isOpen: true,
            currentStatus: customer.status
        });
    };

    const handleBlockConfirm = async () => {
        if (!customer) return;
        const nextStatus = modalState.currentStatus === "Block" ? "Active" : "Block";
        try {
            setIsBlocking(true);
            await api.put(`/admin/updateProfessionalStatus/${user_id}`, {
                status: nextStatus,
                reason: nextStatus === "Block" ? "Blocked by admin" : "Unblocked by admin"
            });
            await fetchData();
            setModalState(prev => ({ ...prev, isOpen: false }));
        } catch (error) {
            console.error("Failed to update customer status:", error);
        } finally {
            setIsBlocking(false);
        }
    };

    const columns: Column<Appointment>[] = [
        { id: "sNo", field: "sNo", header: "S No", sortable: true },
        { id: "service", field: "service", header: "Service", sortable: true },
        { id: "dateTime", field: "dateTime", header: "Date/Time", sortable: true },
        { id: "professional", field: "professional", header: "Professional", sortable: true },
        { id: "amount", field: "amount", header: "Amount", sortable: true },
        {
            id: "action",
            header: "Action",
            accessor: (row) => (
                <Link href={`/appointment-detail?source=customers&id=${row.id}&user_id=${user_id}`} className="flex items-center justify-center hover:bg-gray-100 rounded-md transition-colors w-9 h-9">
                    <EyeIcon className="w-9 h-9" />
                </Link>
            ),
        },
    ];

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="w-full flex flex-col gap-6">
            <Head>
                <title>Customer Profile | Lisa Admin</title>
            </Head>

            {/* Header */}
            <div className="flex items-center gap-3">
                <Link href="/customers" className="flex items-center justify-center w-10 h-10 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </Link>
                <h1 className="text-2xl font-bold text-[#13000A]">Profile</h1>
            </div>

            {/* Profile Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-24 h-24 relative rounded-2xl overflow-hidden bg-gray-200">
                        <Image
                            src={customer?.profileImage || "/images/avatar.png"}
                            alt={customer?.name || "Customer"}
                            fill
                            className="object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/images/avatar.png";
                            }}
                        />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-[#13000A]">{customer?.name || "Unknown"}</h2>
                        <p className="text-gray-500">{customer?.email || ""}</p>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <p className="text-xs text-gray-400 max-w-50 text-center md:text-right">
                        If you want to &quot;Block or Unblock&quot; the user, tap here
                    </p>
                    <Button
                        className="bg-[#FFE5E9] text-[#FF4460] hover:bg-[#FFD1DB] border-none px-8 py-2 h-10 font-semibold rounded-lg w-full md:w-auto"
                        onClick={initiateBlockToggle}
                        disabled={isBlocking || !customer}
                    >
                        {isBlocking
                            ? customer?.status === "Block" ? "Unblocking..." : "Blocking..."
                            : customer?.status === "Block" ? "Unblock" : "Block"}
                    </Button>
                </div>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <FormInput
                    label="Age"
                    defaultValue={String(customer?.age || "")}
                    readOnly
                    className="bg-white border-gray-200 rounded-xl h-12"
                />
                <FormInput
                    label="Gender"
                    defaultValue={customer?.gender || ""}
                    readOnly
                    className="bg-white border-gray-200 rounded-xl h-12"
                />
                <FormInput
                    label="Mobile Number*"
                    defaultValue={customer?.phone || ""}
                    readOnly
                    className="bg-white border-gray-200 rounded-xl h-12 pl-20!"
                    leftSlot={
                        <div className="flex items-center gap-3">
                            <Image
                                src="/icons/US-flag.svg"
                                alt="US"
                                width={24}
                                height={16}
                                className="w-6 h-auto object-contain"
                            />
                            <div className="h-6 w-px bg-gray-200"></div>
                        </div>
                    }
                />
                <FormInput
                    label="Street Address"
                    defaultValue={customer?.formattedAddress || ""}
                    readOnly
                    className="bg-white border-gray-200 rounded-xl h-12"
                />
                <FormInput
                    label="City"
                    defaultValue={customer?.city || ""}
                    readOnly
                    className="bg-white border-gray-200 rounded-xl h-12"
                />
                <FormInput
                    label="State"
                    defaultValue={customer?.state || ""}
                    readOnly
                    className="bg-white border-gray-200 rounded-xl h-12"
                />
                <div className="md:col-span-2">
                    <FormInput
                        label="Zip Code"
                        defaultValue={customer?.zipCode || ""}
                        wrapperClassName="w-full md:w-1/2 pr-0 md:pr-4"
                        readOnly
                        className="bg-white border-gray-200 rounded-xl h-12"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-4 text-[#13000A]">
                    Total Appointments Booked <span className="text-[#FF4460]">({totalAppointments})</span>
                </h3>
                <div className="overflow-hidden  p-6  rounded-lg border border-gray-100">
                    <DataTable
                        columns={columns}
                        data={appointments}
                        pageSize={5}
                        selectable={false}
                        showColumnToggle={false}
                    />
                </div>
            </div>

            <ConfirmationModal
                isOpen={modalState.isOpen}
                onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
                onConfirm={handleBlockConfirm}
                title={modalState.currentStatus === "Active" ? "Block Customer" : "Unblock Customer"}
                message={`Are you sure you want to ${modalState.currentStatus === "Active" ? "block" : "unblock"} ${customer?.name || "this customer"}?`}
                confirmText={modalState.currentStatus === "Active" ? "Block" : "Unblock"}
                isProcessing={isBlocking}
                variant={modalState.currentStatus === "Active" ? "danger" : "info"}
            />
        </div>
    );
}
