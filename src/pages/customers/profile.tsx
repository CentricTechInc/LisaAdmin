import React from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Sidebar } from "@/components/layout/Sidebar";
import { GreetingHeader } from "@/components/layout/GreetingHeader";
import { Button } from "@/components/ui/Button";
import { FormInput } from "@/components/ui/FormInput";
import { DataTable } from "@/components/table/DataTable";
import { EyeIcon } from "@/components/ui/EyeIcon";
import { Column } from "@/components/table/types";

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

export default function CustomerProfile() {
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
        <Link href="/appointment-detail" className="flex items-center justify-center hover:bg-gray-100 rounded-md transition-colors w-9 h-9">
          <EyeIcon className="w-9 h-9" />
        </Link>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Head>
        <title>Customer Profile | Lisa Admin</title>
      </Head>
      <Sidebar activeId="customers" />
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="w-full flex flex-col gap-6">
            <GreetingHeader userName="Alison" />
            
            <div className="flex flex-col gap-6">
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
                                src="/images/b5c17e81cc9828e32c3fa60901037d45d33375ec.jpg" 
                                alt="Eleanor" 
                                fill 
                                className="object-cover"
                                onError={(e) => {
                                }}
                            />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-[#13000A]">Eleanor</h2>
                            <p className="text-gray-500">eleanor@mail.com</p>
                        </div>
                    </div>
                        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                        <p className="text-xs text-gray-400 max-w-[200px] text-center md:text-right">
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
                    <div className="overflow-hidden rounded-lg border border-gray-100">
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
        </div>
      </main>
    </div>
  );
}
