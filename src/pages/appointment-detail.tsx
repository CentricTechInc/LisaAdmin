import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { AppointmentDetailCard, AppointmentDetailData } from "@/components/ui/AppointmentDetailCard";

const APPOINTMENT_DATA: AppointmentDetailData = {
  status: "Completed",
  customer: {
    name: "Eleanor",
    email: "eleanor@mail.com",
    image: "/images/b5c17e81cc9828e32c3fa60901037d45d33375ec.jpg",
  },
  professional: {
    name: "Bloom & Blade",
    category: "Salon",
    phone: "(631) 273-2740",
    email: "b&b@mail.com",
    image: "/images/b5c17e81cc9828e32c3fa60901037d45d33375ec.jpg",
  },
  notes: "Lorem ipsum dolor sit amet consectetur. Cras tincidunt purus sed scelerisque.",
  dateTime: "12 November, 09:00 AM",
  services: [
    {
      sNo: 1,
      name: "Nail",
      dateTime: "12 November, 09:00 AM",
      amount: "$8.00",
    },
    {
      sNo: 2,
      name: "Facial",
      dateTime: "12 November, 09:00 AM",
      amount: "$24.99",
    },
  ],
  payment: {
    method: "Bank Account",
    last4: "2345",
    subTotal: "$32.99",
    platformFee: "$4.95",
    grandTotal: "$28.05",
  },
  review: {
    name: "Eleanor",
    date: "2 days ago",
    rating: 4,
    comment: "The place was clean, great serivce, stall are friendly. I will certainly recommend to my friends and visit again! :)",
    image: "/images/b5c17e81cc9828e32c3fa60901037d45d33375ec.jpg",
  },
};

export default function AppointmentDetail() {
  const router = useRouter();
  const { source, status } = router.query;

  const activeSidebarId = (typeof source === "string" && ["customers", "professionals", "appointments"].includes(source))
    ? source
    : "customers"; // Default or fallback

  // Determine status display
  const currentStatus = (typeof status === "string" && status) 
    ? status.charAt(0).toUpperCase() + status.slice(1) 
    : APPOINTMENT_DATA.status;

  // Clone data with dynamic status
  const data = {
    ...APPOINTMENT_DATA,
    status: currentStatus
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <Head>
        <title>Appointment Detail | Lisa Admin</title>
      </Head>
      
      <AppointmentDetailCard
            data={data}
            onBack={() => {
              if (typeof window !== "undefined" && window.history.length > 1) router.back();
              else router.push(`/${activeSidebarId}`);
            }}
          />
    </div>
  );
}
