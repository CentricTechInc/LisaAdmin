import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/Button";
import { FormInput } from "@/components/ui/FormInput";
import { DataTable } from "@/components/table/DataTable";
import { EyeIcon } from "@/components/ui/EyeIcon";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Column } from "@/components/table/types";
import { FormTextarea } from "@/components/ui/FormTextarea";
import { FileUpload } from "@/components/ui/FileUpload";
import { Checkbox } from "@/components/ui/Checkbox";
import { DaySelector } from "@/components/ui/DaySelector";
import { Modal } from "@/components/ui/Modal";
import api from "@/utils/axios";

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

type SalonService = {
    name: string;
};

type WeeklySchedule = {
    day_of_week: string;
    is_open: boolean;
    start_time: string | null;
    end_time: string | null;
};

type BreakTime = {
    has_break: boolean;
    break_start_time: string | null;
    break_end_time: string | null;
};

type BankDetail = {
    bank_name: string;
    account_number: string;
    account_holder_name: string;
    isCurrent?: boolean;
};

type SalonProfileData = {
    id: number;
    businessName: string;
    email: string;
    phone: string;
    age: number | string;
    gender: string;
    profileImage: string;
    status: string;
    rejectionReason: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    licenseType: string;
    licenseNumber: string;
    issuingState: string;
    totalExperience: number | string;
    totalProfessionals: number | string;
    bio: string;
    certificateUrl: string;
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    services: string[];
    scheduleStart: string | null;
    scheduleEnd: string | null;
    breakStart: string | null;
    breakEnd: string | null;
};

const getFileName = (url?: string) => {
    if (!url) return "";
    const cleanUrl = url.split("?")[0];
    return cleanUrl.substring(cleanUrl.lastIndexOf("/") + 1) || cleanUrl;
};

const defaultServices = ["Hairstyling", "Nail", "Hair color", "Body Glowing", "Retouch", "Facial", "Spa", "Eyebrows", "Makeup", "Corner lashes"];

const to12Hour = (time?: string | null) => {
    if (!time) return { time: "--:--", period: "--" };
    const [hStr, mStr] = time.split(":");
    const hours = Number(hStr);
    if (Number.isNaN(hours)) return { time: "--:--", period: "--" };
    const period = hours >= 12 ? "PM" : "AM";
    const normalizedHours = hours % 12 || 12;
    const minutes = mStr ?? "00";
    return { time: `${String(normalizedHours).padStart(2, "0")}:${minutes}`, period };
};

const toDayId = (day?: string) => {
    if (!day) return "";
    const key = day.toLowerCase();
    if (key.startsWith("mon")) return "mon";
    if (key.startsWith("tue")) return "tue";
    if (key.startsWith("wed")) return "wed";
    if (key.startsWith("thu")) return "thu";
    if (key.startsWith("fri")) return "fri";
    if (key.startsWith("sat")) return "sat";
    if (key.startsWith("sun")) return "sun";
    return "";
};

export default function ProfessionalProfile() {
    const router = useRouter();
    const isPending = router.query.status === 'pending';
    const isRejected = router.query.status === 'rejected';
    const [activeTab, setActiveTab] = useState("personal");
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const salonId = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;
    const userId = Array.isArray(router.query.user_id) ? router.query.user_id[0] : router.query.user_id;
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [salon, setSalon] = useState<SalonProfileData | null>(null);
    const isBlocked = router.query.status === 'blocked' || salon?.status === 'Block';
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [totalAppointments, setTotalAppointments] = useState(0);
    const [isStatusUpdating, setIsStatusUpdating] = useState(false);
    const [statusError, setStatusError] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState("");

    useEffect(() => {
        if (!router.isReady) return;
        if (!salonId && !userId) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const salonResponse = salonId ? await api.get(`/admin/get-salon-by-id/${salonId}`) : null;
                const appointmentsResponse = userId ? await api.get(`/appointment/details/${userId}?page=1`) : null;

                const salonData = salonResponse?.data?.data?.data || {};
                const userData = salonData?.user || salonData?.user_data || {};
                const bankDetails: BankDetail[] = Array.isArray(userData?.salonBankDetail) ? userData.salonBankDetail : [];
                const currentBank = bankDetails.find((detail) => detail.isCurrent) || bankDetails[0];
                const services: SalonService[] = Array.isArray(salonData?.services) ? salonData.services : [];
                const serviceNames = services.map((service) => service?.name).filter(Boolean) as string[];
                const weeklySchedules: WeeklySchedule[] = Array.isArray(salonData?.weeklySchedules) ? salonData.weeklySchedules : [];
                const openSchedules = weeklySchedules.filter((schedule) => schedule.is_open);
                const selectedScheduleDays = openSchedules.map((schedule) => toDayId(schedule.day_of_week)).filter(Boolean) as string[];
                const primarySchedule = openSchedules[0] || weeklySchedules[0];
                const breakTime: BreakTime = salonData?.breakTime || {};
                const fallbackName = `${userData?.first_name || ""} ${userData?.last_name || ""}`.trim();

                const rawStatus = userData?.status || salonData?.status || "Active";
                const normalizedStatus = rawStatus === "Blocked" ? "Block" : rawStatus;
                const fetchedRejectionReason = salonData?.reject_reason || salonData?.rejection_reason || salonData?.reason || "";

                setSalon({
                    id: salonData?.id || 0,
                    businessName: salonData?.bussiness_name || salonData?.business_name || fallbackName || "Unknown",
                    email: userData?.email || "",
                    phone: userData?.phone_number || "",
                    age: userData?.age ?? "N/A",
                    gender: userData?.gender || "N/A",
                    profileImage: salonData?.picture || userData?.picture || "/images/avatar.png",
                    status: normalizedStatus,
                    rejectionReason: fetchedRejectionReason,
                    streetAddress: salonData?.street_address || "",
                    city: salonData?.city || "",
                    state: salonData?.state || "",
                    zipCode: salonData?.zipcode ? String(salonData?.zipcode) : "",
                    country: salonData?.country || "",
                    licenseType: salonData?.license_type || "N/A",
                    licenseNumber: salonData?.license_number || "N/A",
                    issuingState: salonData?.issuing_state || "N/A",
                    totalExperience: salonData?.total_experience ?? "N/A",
                    totalProfessionals: salonData?.total_professionals ?? "N/A",
                    bio: salonData?.professionol_bio || "",
                    certificateUrl: salonData?.certificate || "",
                    accountHolderName: currentBank?.account_holder_name || "",
                    bankName: currentBank?.bank_name || "",
                    accountNumber: currentBank?.account_number || "",
                    services: serviceNames,
                    scheduleStart: primarySchedule?.start_time ?? null,
                    scheduleEnd: primarySchedule?.end_time ?? null,
                    breakStart: breakTime?.has_break ? breakTime?.break_start_time ?? null : null,
                    breakEnd: breakTime?.has_break ? breakTime?.break_end_time ?? null : null
                });
                setSelectedServices(serviceNames);
                setSelectedDays(selectedScheduleDays);
                setRejectReason(fetchedRejectionReason);

                const appointmentsData = appointmentsResponse?.data?.data?.data?.rows || [];
                const appointmentsCount = appointmentsResponse?.data?.data?.data?.count || 0;
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
        };

        fetchData();
    }, [router.isReady, salonId, userId]);

    const resolveProfessionalId = salonId || userId;

    const updateProfessionalStatus = async (status: string, reason: string) => {
        if (!resolveProfessionalId) return false;
        try {
            setIsStatusUpdating(true);
            setStatusError(null);
            await api.put(`/admin/updateProfessionalStatus/${resolveProfessionalId}`, {
                status,
                reason
            });
            setSalon((prev) =>
                prev
                    ? {
                          ...prev,
                          status,
                          rejectionReason: (status === "Rejected" || status === "Block") ? reason : prev.rejectionReason
                      }
                    : prev
            );
            return true;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to update status";
            setStatusError(message);
            return false;
        } finally {
            setIsStatusUpdating(false);
        }
    };

    const handleBlockToggle = async () => {
        if (!salon) return;
        const nextStatus = salon.status === "Block" ? "Active" : "Block";
        const reason = nextStatus === "Block" ? "Blocked by admin" : "Unblocked by admin";
        await updateProfessionalStatus(nextStatus, reason);
    };

    const handleApprove = async () => {
        const success = await updateProfessionalStatus("Approved", "Approved by admin");
        if (success) {
            router.back();
        }
    };

    const handleRejectSubmit = async () => {
        if (!rejectReason.trim()) {
            setStatusError("Please provide a reason for rejection.");
            return;
        }
        const success = await updateProfessionalStatus("Rejected", rejectReason.trim());
        if (success) {
            setIsRejectModalOpen(false);
            router.back();
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
                <Link
                    href={`/appointment-detail?source=customers&id=${row.id}&user_id=${userId || ""}`}
                    className="flex items-center justify-center hover:bg-gray-100 rounded-md transition-colors"
                    aria-label="View appointment details"
                >
                    <EyeIcon className="w-9 h-9" />
                </Link>
            ),
        },
    ];

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    const scheduleStart = to12Hour(salon?.scheduleStart);
    const scheduleEnd = to12Hour(salon?.scheduleEnd);
    const breakStart = to12Hour(salon?.breakStart);
    const breakEnd = to12Hour(salon?.breakEnd);
    const availableServices = salon?.services?.length ? salon.services : defaultServices;

    return (
        <>
            <Head>
                <title>Professional Profile | Lisa Admin</title>
            </Head>
            <div className="w-full flex flex-col gap-6">
                <div className="flex flex-col gap-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Link href="/professionals" className="flex items-center justify-center w-10 h-10 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M15 18l-6-6 6-6" />
                                </svg>
                            </Link>
                            <h1 className="text-2xl font-bold text-[#13000A]">Profile</h1>
                        </div>
                        <SegmentedControl
                            options={[
                                { id: "personal", label: "Personal Info" },
                                { id: "professional", label: "Professional Info" },
                            ]}
                            value={activeTab}
                            onChange={setActiveTab}
                            className="w-full md:w-auto"
                        />
                    </div>

                    {activeTab === "personal" ? (
                        <div className="flex flex-col gap-6">
                            {/* Profile Card */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-24 h-24 relative rounded-2xl overflow-hidden bg-gray-200">
                                        <Image
                                            src={salon?.profileImage || "/images/b5c17e81cc9828e32c3fa60901037d45d33375ec.jpg"}
                                            alt={salon?.businessName || "Salon"}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-[#13000A]">{salon?.businessName || "Salon"}</h2>
                                        <p className="text-gray-500">{salon?.email || "email@example.com"}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                                    <p className="text-xs text-gray-400 max-w-50 text-center md:text-right">
                                        If you want to &quot;Block or Unblock&quot; the user, tap here
                                    </p>
                                    <Button
                                        className="bg-[#FFE5E9] text-[#FF4460] hover:bg-[#FFD1DB] border-none px-8 py-2 h-10 font-semibold rounded-lg w-full md:w-auto"
                                        onClick={handleBlockToggle}
                                        disabled={isStatusUpdating || !salon}
                                    >
                                        {isStatusUpdating
                                            ? salon?.status === "Block"
                                                ? "Unblocking..."
                                                : "Blocking..."
                                            : salon?.status === "Block"
                                            ? "Unblock"
                                            : "Block"}
                                    </Button>
                                </div>
                            </div>
                            {statusError && (
                                <div className="text-red-600 bg-red-50 px-4 py-2 rounded-lg text-sm">
                                    {statusError}
                                </div>
                            )}

                            {/* Form */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <FormInput
                                    label="Age"
                                    value={String(salon?.age ?? "N/A")}
                                    readOnly
                                    className="bg-white border-gray-200 rounded-xl h-12"
                                />
                                <FormInput
                                    label="Gender"
                                    value={salon?.gender || "N/A"}
                                    readOnly
                                    className="bg-white border-gray-200 rounded-xl h-12"
                                />
                                <FormInput
                                    label="Mobile Number*"
                                    value={salon?.phone || ""}
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
                                    value={salon?.streetAddress || ""}
                                    readOnly
                                    className="bg-white border-gray-200 rounded-xl h-12"
                                />
                                <FormInput
                                    label="City"
                                    value={salon?.city || ""}
                                    readOnly
                                    className="bg-white border-gray-200 rounded-xl h-12"
                                />
                                <FormInput
                                    label="State"
                                    value={salon?.state || ""}
                                    readOnly
                                    className="bg-white border-gray-200 rounded-xl h-12"
                                />
                                <div className="md:col-span-2">
                                    <FormInput
                                        label="Zip Code"
                                        value={salon?.zipCode || ""}
                                        wrapperClassName="w-full md:w-1/2 pr-0 md:pr-4"
                                        readOnly
                                        className="bg-white border-gray-200 rounded-xl h-12"
                                    />
                                </div>
                            </div>

                            {/* Table */}
                            {!isPending && !isBlocked && (
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
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            {/* License Information */}
                            <div className="flex flex-col gap-6">
                                <h3 className="font-bold text-lg text-[#13000A]">License Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormInput label="License Type" value={salon?.licenseType || "N/A"} readOnly className="bg-white border-gray-200 rounded-xl h-12" />
                                    <FormInput label="License Number" value={salon?.licenseNumber || "N/A"} readOnly className="bg-white border-gray-200 rounded-xl h-12" />
                                    <FormInput label="Issuing State/Country" value={salon?.issuingState || "N/A"} readOnly className="bg-white border-gray-200 rounded-xl h-12" />
                                    <FormInput label="Years Of Experience" value={String(salon?.totalExperience ?? "N/A")} readOnly className="bg-white border-gray-200 rounded-xl h-12" />
                                    <FormInput label="How Many Professionals Are On Your Team?" value={String(salon?.totalProfessionals ?? "N/A")} readOnly className="bg-white border-gray-200 rounded-xl h-12" />
                                    <FileUpload
                                        label="License/Certificate"
                                        fileName={getFileName(salon?.certificateUrl) || "No file uploaded"}
                                        onDownload={salon?.certificateUrl ? () => window.open(salon.certificateUrl, "_blank", "noopener,noreferrer") : undefined}
                                        className="h-12 border-gray-200"
                                    />
                                    <div className="md:col-span-2">
                                        <FormTextarea
                                            label="Bio/Headline"
                                            value={salon?.bio || ""}
                                            readOnly
                                            className="h-32 bg-white border-gray-200 rounded-xl resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Account Detail */}
                            <div className="flex flex-col gap-6">
                                <h3 className="font-bold text-lg text-[#13000A]">Account Detail</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormInput label="Account Holder Name" value={salon?.accountHolderName || ""} readOnly className="bg-white border-gray-200 rounded-xl h-12" />
                                    <FormInput label="Bank Name" value={salon?.bankName || ""} readOnly className="bg-white border-gray-200 rounded-xl h-12" />
                                    <div className="md:col-span-2">
                                        <FormInput label="Account Number" value={salon?.accountNumber || ""} readOnly className="bg-white border-gray-200 rounded-xl h-12" />
                                    </div>
                                </div>
                            </div>

                            {/* Services */}
                            <div className="flex flex-col gap-6">
                                <h3 className="font-bold text-lg text-[#13000A]">Services</h3>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-y-4 gap-x-8">
                                    {availableServices.map((service) => (
                                        <Checkbox
                                            key={service}
                                            label={service}
                                            checked={selectedServices.includes(service)}
                                            onChange={() => {
                                                if (selectedServices.includes(service)) {
                                                    setSelectedServices(selectedServices.filter(s => s !== service));
                                                } else {
                                                    setSelectedServices([...selectedServices, service]);
                                                }
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Availability Schedule */}
                            <div className="flex  gap-6 justify-between items-center">
                                <h3 className="font-bold text-lg text-[#13000A] min-w-fit">Availability Schedule</h3>
                                <div className="flex items-center gap-4 flex-wrap">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <span>From</span>
                                        <div className="flex items-center gap-2 bg-[#F3F4F6] rounded-xl px-4 py-2 min-w-25 justify-between">
                                            <span className="font-bold text-gray-900">{scheduleStart.time}</span>
                                            <span className="font-bold text-[#FF4460]">{scheduleStart.period}</span>
                                        </div>
                                        <span>—</span>
                                        <span>To</span>
                                        <div className="flex items-center gap-2 bg-[#F3F4F6] rounded-xl px-4 py-2 min-w-25 justify-between">
                                            <span className="font-bold text-gray-900">{scheduleEnd.time}</span>
                                            <span className="font-bold text-[#FF4460]">{scheduleEnd.period}</span>
                                        </div>
                                    </div>
                                </div>
                                <DaySelector selectedDays={selectedDays} onChange={setSelectedDays} />
                            </div>

                            {/* Break Time */}
                            <div className="flex items-center gap-4 flex-wrap">
                                <h3 className="font-bold text-lg text-[#13000A] min-w-fit">Break Time</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <span>From</span>
                                    <div className="flex items-center gap-2 bg-[#F3F4F6] rounded-xl px-4 py-2 min-w-25 justify-between">
                                        <span className="font-bold text-gray-900">{breakStart.time}</span>
                                        <span className="font-bold text-[#FF4460]">{breakStart.period}</span>
                                    </div>
                                    <span>—</span>
                                    <span>To</span>
                                    <div className="flex items-center gap-2 bg-[#F3F4F6] rounded-xl px-4 py-2 min-w-25 justify-between">
                                        <span className="font-bold text-gray-900">{breakEnd.time}</span>
                                        <span className="font-bold text-[#FF4460]">{breakEnd.period}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer Actions for Pending Requests */}
                    {isPending && (
                        <div className="flex justify-end gap-4 mt-4 pt-4 border-t border-gray-100">
                            <Button
                                className="bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 px-8"
                                onClick={() => setIsRejectModalOpen(true)}
                                disabled={isStatusUpdating}
                            >
                                Reject
                            </Button>
                            <Button
                                className="bg-[#00C853] hover:bg-[#00A844] text-white px-8 border-none"
                                onClick={handleApprove}
                                disabled={isStatusUpdating}
                            >
                                {isStatusUpdating ? "Approving..." : "Approve"}
                            </Button>
                        </div>
                    )}

                    {/* Reason of Rejection for Rejected or Blocked Professionals */}
                    {(isRejected || isBlocked) && activeTab === "personal" && (
                        <div className="flex flex-col gap-4 mt-8">
                            <h3 className="text-xl font-bold text-[#13000A]">Reason for Rejection</h3>
                            <div className="bg-white border border-gray-200 rounded-xl p-6 text-gray-500 text-sm leading-relaxed">
                                {salon?.rejectionReason || "N/A"}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* Reject Modal */}
            <Modal
                isOpen={isRejectModalOpen}
                onClose={() => setIsRejectModalOpen(false)}
                className="max-w-2xl"
            >
                <div className="flex flex-col gap-6">
                    <h2 className="text-2xl font-bold text-[#13000A]">Reason of Rejection</h2>
                    <FormTextarea
                        wrapperClassName="w-full"
                        className="min-h-5 resize-none border-gray-200 rounded-xl"
                        placeholder="Type reason..."
                        value={rejectReason}
                        onChange={(event) => setRejectReason(event.target.value)}
                    />
                    {statusError && (
                        <div className="text-red-600 bg-red-50 px-4 py-2 rounded-lg text-sm">
                            {statusError}
                        </div>
                    )}
                    <div className="flex justify-end">
                        <Button
                            className="bg-[#FF4460] hover:bg-[#FF2E4D] text-white px-8 h-12 rounded-xl font-semibold border-none"
                            onClick={handleRejectSubmit}
                            disabled={isStatusUpdating}
                        >
                            {isStatusUpdating ? "Submitting..." : "Submit"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
