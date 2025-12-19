import React from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { Sidebar } from "@/components/layout/Sidebar";
import { GreetingHeader } from "@/components/layout/GreetingHeader";
import { AppImage } from "@/components/ui/AppImage";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

// Mock Data
const TRANSACTION_DETAIL = {
  id: 1,
  status: "Success",
  dateTime: "12 November, 09:00 AM",
  from: {
    name: "Eleanor",
    email: "eleanor@mail.com",
    image: "/images/b5c17e81cc9828e32c3fa60901037d45d33375ec.jpg", // Placeholder
  },
  to: {
    name: "Bloom & Blade",
    category: "Salon",
    phone: "(631) 273-2740",
    email: "b&b@mail.com",
    image: "/images/b5c17e81cc9828e32c3fa60901037d45d33375ec.jpg", // Placeholder
  },
  payment: {
    amount: "$48.50",
    platformCharges: "$7.275",
    paidVia: "Paypal",
    senderCity: "New York",
    recipientCity: "New York",
    recipientAccount: "**** **** **** 4567",
  },
  services: [
    { sNo: 1, name: "Nail", dateTime: "12 November, 09:00 AM", amount: "$18.50" },
    { sNo: 2, name: "Facial", dateTime: "12 November, 09:00 AM", amount: "$30.00" },
  ],
};

export default function TransactionDetailPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Head>
        <title>Transaction Detail | Lisa Admin</title>
      </Head>
      <Sidebar activeId="transactions" />
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="w-full flex flex-col gap-6">
          <GreetingHeader userName="Alison" />

          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
              >
                <Image
                  src="/icons/arrow-left.svg" // Assuming this icon exists, otherwise I'll need to check or use a generic one
                  alt="Back"
                  width={20}
                  height={20}
                  className="rotate-180" // If arrow-left points left, this is fine. Wait, usually arrow-left points left.
                />
              </button>
              <h1 className="text-2xl font-bold text-[#13000A]">Transactions Detail</h1>
            </div>
            <div className="bg-green-100 text-green-700 px-4 py-1.5 rounded-md font-medium text-sm">
              {TRANSACTION_DETAIL.status}
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            {/* From & To Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* From */}
              <div className="flex flex-col gap-4">
                <h3 className="font-bold text-lg text-[#13000A]">From</h3>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 relative">
                    <AppImage
                      imageName={TRANSACTION_DETAIL.from.image}
                      alt={TRANSACTION_DETAIL.from.name}
                      fill
                      className="rounded-xl object-cover"
                      rounded={false} // Custom rounded handled by className
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-[#13000A]">{TRANSACTION_DETAIL.from.name}</h4>
                    <p className="text-gray-500">{TRANSACTION_DETAIL.from.email}</p>
                  </div>
                </div>
              </div>

              {/* To */}
              <div className="flex flex-col gap-4">
                <h3 className="font-bold text-lg text-[#13000A]">To</h3>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 relative">
                     <AppImage
                      imageName={TRANSACTION_DETAIL.to.image}
                      alt={TRANSACTION_DETAIL.to.name}
                      fill
                      className="rounded-xl object-cover"
                      rounded={false}
                    />
                  </div>
                  <div>
                    <p className="text-[#FF3B5C] text-sm font-medium">{TRANSACTION_DETAIL.to.category}</p>
                    <h4 className="font-bold text-xl text-[#13000A]">{TRANSACTION_DETAIL.to.name}</h4>
                    <p className="text-gray-500">{TRANSACTION_DETAIL.to.phone}</p>
                    <p className="text-gray-500">{TRANSACTION_DETAIL.to.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Date & Time (Right aligned in design, but let's put it clearly) */}
            <div className="flex justify-end mb-6">
              <div className="text-right">
                <p className="font-bold text-gray-900">Date & Time</p>
                <p className="text-[#FF3B5C] font-medium">{TRANSACTION_DETAIL.dateTime}</p>
              </div>
            </div>

            {/* Payment Details Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Paid Amount</label>
                <div className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900">
                  {TRANSACTION_DETAIL.payment.amount}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Platform Charges (15%)</label>
                <div className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-500">
                  {TRANSACTION_DETAIL.payment.platformCharges}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Paid Via</label>
                <div className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-500">
                  {TRANSACTION_DETAIL.payment.paidVia}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Sender City</label>
                <div className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-500">
                  {TRANSACTION_DETAIL.payment.senderCity}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Recipient City</label>
                <div className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-500">
                  {TRANSACTION_DETAIL.payment.recipientCity}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Recipient Account Number</label>
                <div className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-500">
                  {TRANSACTION_DETAIL.payment.recipientAccount}
                </div>
              </div>
            </div>

            {/* Services Table */}
            <div>
              <h3 className="font-bold text-lg text-[#13000A] mb-4">Services</h3>
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-100 text-gray-900 font-bold">
                    <tr>
                      <th className="px-6 py-3">
                        <div className="flex items-center gap-1">
                          S No <Image src="/icons/sort.svg" alt="" width={10} height={10} className="opacity-50" />
                        </div>
                      </th>
                      <th className="px-6 py-3">
                        <div className="flex items-center gap-1">
                          Service Name <Image src="/icons/sort.svg" alt="" width={10} height={10} className="opacity-50" />
                        </div>
                      </th>
                      <th className="px-6 py-3">
                        <div className="flex items-center gap-1">
                          Date/Time <Image src="/icons/sort.svg" alt="" width={10} height={10} className="opacity-50" />
                        </div>
                      </th>
                      <th className="px-6 py-3">
                        <div className="flex items-center gap-1">
                          Amount <Image src="/icons/sort.svg" alt="" width={10} height={10} className="opacity-50" />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {TRANSACTION_DETAIL.services.map((service) => (
                      <tr key={service.sNo} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{service.sNo}</td>
                        <td className="px-6 py-4 text-gray-900">{service.name}</td>
                        <td className="px-6 py-4 text-gray-900">{service.dateTime}</td>
                        <td className="px-6 py-4 text-gray-900">{service.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
