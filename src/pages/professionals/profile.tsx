import React from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Sidebar } from "@/components/layout/Sidebar";
import { GreetingHeader } from "@/components/layout/GreetingHeader";
import { Button } from "@/components/ui/Button";
import { FormInput } from "@/components/ui/FormInput";
import { DataTable } from "@/components/table/DataTable";
import { EyeIcon } from "@/components/ui/EyeIcon";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Column } from "@/components/table/types";
import { useState } from "react";
import { FormTextarea } from "@/components/ui/FormTextarea";
import { FileUpload } from "@/components/ui/FileUpload";
import { Checkbox } from "@/components/ui/Checkbox";
import { DaySelector } from "@/components/ui/DaySelector";
import { Modal } from "@/components/ui/Modal";

// Types
type Appointment = {
    id: number;
    sNo: number;
    service: string;
    dateTime: string;
    professional: string;
    amount: string;
};

// Dummy Data
const appointments: Appointment[] = [
    { id: 1, sNo: 1, service: "Nail", dateTime: "12 November, 09:00 AM", professional: "Salon", amount: "$18.50" },
    { id: 2, sNo: 2, service: "Facial", dateTime: "12 November, 09:00 AM", professional: "Individual Service Providers", amount: "$30.00" },
];

export default function ProfessionalProfile() {
    const router = useRouter();
    const isPending = router.query.status === 'pending';
    const isRejected = router.query.status === 'rejected';
    const [activeTab, setActiveTab] = useState("personal");
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [selectedDays, setSelectedDays] = useState<string[]>(["mon", "tue", "wed", "thu", "fri"]);
    const [selectedServices, setSelectedServices] = useState<string[]>([
        "Hairstyling", "Nail", "Hair color", "Body Glowing", "Retouch",
        "Facial", "Spa", "Eyebrows", "Makeup", "Corner lashes"
    ]);

    const columns: Column<Appointment>[] = [
        { id: "sNo", field: "sNo", header: "S No", sortable: true },
        { id: "service", field: "service", header: "Service", sortable: true },
        { id: "dateTime", field: "dateTime", header: "Date/Time", sortable: true },
        { id: "professional", field: "professional", header: "Professional", sortable: true },
        { id: "amount", field: "amount", header: "Amount", sortable: true },
        {
            id: "action",
            header: "Action",
            accessor: (_row) => (
                <button
                    type="button"
                    onClick={() => router.push("/appointment-detail?source=professionals")}
                    className="flex items-center justify-center hover:bg-gray-100 rounded-md transition-colors"
                    aria-label="View appointment details"
                >
                    <EyeIcon className="w-9 h-9" />
                </button>
            ),
        },
    ];

    return (
        <div className="flex min-h-screen bg-[#F9FAFB]">
            <Head>
                <title>Professional Profile | Lisa Admin</title>
            </Head>
            <Sidebar />
            <main className="flex-1 p-6 overflow-y-auto">
                <div className="w-full flex flex-col gap-6">
                    <GreetingHeader userName="Alison" />

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
                                            {/* Using a placeholder if avatar not found, but trying public/images/avatar.png as in Sidebar */}
                                            <Image
                                                src="/images/b5c17e81cc9828e32c3fa60901037d45d33375ec.jpg"
                                                alt="Eleanor"
                                                fill
                                                className="object-cover"
                                                onError={(e) => {
                                                    // Fallback logic if needed, but Next/Image handles layout
                                                    // For now assume image exists or shows empty
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-[#13000A]">Eleanor</h2>
                                            <p className="text-gray-500">eleanor@mail.com</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                                        <p className="text-xs text-gray-400 max-w-50 text-center md:text-right">
                                            If you want to &quot;Block or Unblock&quot; the user, tap here
                                        </p>
                                        <Button
                                            className="bg-[#FFE5E9] text-[#FF4460] hover:bg-[#FFD1DB] border-none px-8 py-2 h-10 font-semibold rounded-lg w-full md:w-auto"
                                        >
                                            Block
                                        </Button>
                                    </div>
                                </div>

                                {/* Form */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    <FormInput
                                        label="Age"
                                        defaultValue="25"
                                        readOnly
                                        className="bg-white border-gray-200 rounded-xl h-12"
                                    />
                                    <FormInput
                                        label="Gander"
                                        defaultValue="Female"
                                        readOnly
                                        className="bg-white border-gray-200 rounded-xl h-12"
                                    />
                                    <FormInput
                                        label="Mobile Number*"
                                        defaultValue="(631) 273-2740"
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
                                        defaultValue="1158 Suffolk Ave #3"
                                        readOnly
                                        className="bg-white border-gray-200 rounded-xl h-12"
                                    />
                                    <FormInput
                                        label="City"
                                        defaultValue="Brentwood"
                                        readOnly
                                        className="bg-white border-gray-200 rounded-xl h-12"
                                    />
                                    <FormInput
                                        label="State"
                                        defaultValue="New York"
                                        readOnly
                                        className="bg-white border-gray-200 rounded-xl h-12"
                                    />
                                    <div className="md:col-span-2">
                                        <FormInput
                                            label="Zip Code"
                                            defaultValue="11717"
                                            wrapperClassName="w-full md:w-1/2 pr-0 md:pr-4"
                                            readOnly
                                            className="bg-white border-gray-200 rounded-xl h-12"
                                        />
                                    </div>
                                </div>

                                {/* Table */}
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <h3 className="text-lg font-bold mb-4 text-[#13000A]">
                                        Total Appointments Booked <span className="text-[#FF4460]">(24)</span>
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
                            </div>
                        ) : (
                            <div className="flex flex-col gap-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                {/* License Information */}
                                <div className="flex flex-col gap-6">
                                    <h3 className="font-bold text-lg text-[#13000A]">License Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormInput label="License Type" defaultValue="Barber" className="bg-white border-gray-200 rounded-xl h-12" />
                                        <FormInput label="License Number" defaultValue="ABC1289" className="bg-white border-gray-200 rounded-xl h-12" />
                                        <FormInput label="Issuing State/Country" defaultValue="United States" className="bg-white border-gray-200 rounded-xl h-12" />
                                        <FormInput label="Years Of Experience" defaultValue="05" className="bg-white border-gray-200 rounded-xl h-12" />
                                        <FormInput label="How Many Professionals Are On Your Team?" defaultValue="07" className="bg-white border-gray-200 rounded-xl h-12" />
                                        <FileUpload
                                            label="License/Certificate"
                                            fileName="License Photo.jpeg"
                                            onDownload={() => { }}
                                            onDelete={() => { }}
                                            className="h-12 border-gray-200"
                                        />
                                        <div className="md:col-span-2">
                                            <FormTextarea
                                                label="Bio/Headline"
                                                defaultValue="Bloom & Blade salon, established in 2003 in Celina, Delaware, prides itself on delivering exceptional service at a fair price. Our dedicated team is committed to making every visit a delightful experience, ensuring that you leave feeling refreshed and beautiful. We believe in creating a welcoming atmosphere where every client feels valued."
                                                className="h-32 bg-white border-gray-200 rounded-xl resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Account Detail */}
                                <div className="flex flex-col gap-6">
                                    <h3 className="font-bold text-lg text-[#13000A]">Account Detail</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormInput label="Account Holder Name" defaultValue="Bloom & Blade" className="bg-white border-gray-200 rounded-xl h-12" />
                                        <FormInput label="Bank Name" defaultValue="Abc Bank Limited" className="bg-white border-gray-200 rounded-xl h-12" />
                                        <div className="md:col-span-2">
                                            <FormInput label="Account Number" defaultValue="4123 4568 9785 2345" className="bg-white border-gray-200 rounded-xl h-12" />
                                        </div>
                                    </div>
                                </div>

                                {/* Services */}
                                <div className="flex flex-col gap-6">
                                    <h3 className="font-bold text-lg text-[#13000A]">Services</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-y-4 gap-x-8">
                                        {["Hairstyling", "Nail", "Hair color", "Body Glowing", "Retouch", "Facial", "Spa", "Eyebrows", "Makeup", "Corner lashes"].map((service) => (
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
                                <div className="flex flex-col gap-6">
                                    <div className="flex items-center gap-4 flex-wrap">
                                        <h3 className="font-bold text-lg text-[#13000A] min-w-fit">Availability Schedule</h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <span>From</span>
                                            <div className="flex items-center gap-2 bg-[#F3F4F6] rounded-xl px-4 py-2 min-w-25 justify-between">
                                                <span className="font-bold text-gray-900">08:30</span>
                                                <span className="font-bold text-[#FF4460]">AM</span>
                                            </div>
                                            <span>—</span>
                                            <span>To</span>
                                            <div className="flex items-center gap-2 bg-[#F3F4F6] rounded-xl px-4 py-2 min-w-25 justify-between">
                                                <span className="font-bold text-gray-900">09:30</span>
                                                <span className="font-bold text-[#FF4460]">PM</span>
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
                                            <span className="font-bold text-gray-900">12:30</span>
                                            <span className="font-bold text-[#FF4460]">PM</span>
                                        </div>
                                        <span>—</span>
                                        <span>To</span>
                                        <div className="flex items-center gap-2 bg-[#F3F4F6] rounded-xl px-4 py-2 min-w-25 justify-between">
                                            <span className="font-bold text-gray-900">01:30</span>
                                            <span className="font-bold text-[#FF4460]">PM</span>
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
                                >
                                    Reject
                                </Button>
                                <Button
                                    className="bg-[#00C853] hover:bg-[#00A844] text-white px-8 border-none"
                                    onClick={() => router.back()}
                                >
                                    Approve
                                </Button>
                            </div>
                        )}

                        {/* Reason of Rejection for Rejected Professionals */}
                        {isRejected && activeTab === "personal" && (
                            <div className="flex flex-col gap-4 mt-8">
                                <h3 className="text-xl font-bold text-[#13000A]">Reason of Rejection</h3>
                                <div className="bg-white border border-gray-200 rounded-xl p-6 text-gray-500 text-sm leading-relaxed">
                                    At Bloom & Blade salon, we strive to provide outstanding service at reasonable prices since our inception in 2003 in Celina, Delaware. Our passionate team is dedicated to ensuring that each visit is enjoyable, leaving you feeling rejuvenated and beautiful. We aim to foster a friendly environment where every client is appreciated.
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

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
                        defaultValue="At Bloom & Blade salon, we strive to provide outstanding service at reasonable prices since our inception in 2003 in Celina, Delaware. Our passionate team is dedicated to ensuring that each visit is enjoyable, leaving you feeling rejuvenated and beautiful. We aim to foster a friendly environment where every client is appreciated."
                    />
                    <div className="flex justify-end">
                        <Button
                            className="bg-[#FF4460] hover:bg-[#FF2E4D] text-white px-8 h-12 rounded-xl font-semibold border-none"
                            onClick={() => {
                                setIsRejectModalOpen(false);
                                router.back();
                            }}
                        >
                            Submit
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
