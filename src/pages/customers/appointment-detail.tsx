import React from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Sidebar } from "@/components/layout/Sidebar";
import { GreetingHeader } from "@/components/layout/GreetingHeader";

export default function AppointmentDetail() {
  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Head>
        <title>Appointment Detail | Lisa Admin</title>
      </Head>
      <Sidebar activeId="customers" />
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="w-full flex flex-col gap-6">
            <GreetingHeader userName="Alison" />
            
            <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/customers/profile" className="flex items-center justify-center w-10 h-10 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                        </Link>
                        <h1 className="text-2xl font-bold text-[#13000A]">Detail</h1>
                    </div>
                    <div className="px-4 py-1.5 bg-[#E6F6EC] text-[#039855] text-sm font-medium rounded-md">
                        Completed
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-8">
                    {/* Customer & Professional Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Customer Info */}
                        <div className="flex flex-col gap-4">
                            <h3 className="font-semibold text-lg text-[#13000A]">Customer Information</h3>
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 relative rounded-xl overflow-hidden bg-gray-200 shrink-0">
                                    <Image 
                                        src="/images/b5c17e81cc9828e32c3fa60901037d45d33375ec.jpg" 
                                        alt="Eleanor" 
                                        fill 
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-[#13000A]">Eleanor</h2>
                                    <p className="text-gray-500">eleanor@mail.com</p>
                                </div>
                            </div>
                        </div>

                        {/* Professional Info */}
                        <div className="flex flex-col gap-4">
                            <h3 className="font-semibold text-lg text-[#13000A]">Professional Information</h3>
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 relative rounded-xl overflow-hidden bg-gray-200 shrink-0">
                                    <Image 
                                        src="/images/b5c17e81cc9828e32c3fa60901037d45d33375ec.jpg" 
                                        alt="Bloom & Blade" 
                                        fill 
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <div className="text-[#FF4460] text-xs font-medium mb-1">Salon</div>
                                    <h2 className="text-xl font-bold text-[#13000A]">Bloom & Blade</h2>
                                    <p className="text-gray-500">(631) 273-2740</p>
                                    <p className="text-gray-500">b&b@mail.com</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes & Date */}
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div className="flex flex-col gap-2 max-w-xl">
                            <h3 className="font-semibold text-[#13000A]">Notes</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Lorem ipsum dolor sit amet consectetur. Cras tincidunt purus sed scelerisque.
                            </p>
                        </div>
                        <div className="flex flex-col gap-1 text-right">
                            <h3 className="font-semibold text-[#13000A]">Date & Time</h3>
                            <p className="text-[#FF4460] font-medium">12 November, 09:00 AM</p>
                        </div>
                    </div>

                    {/* Service & Payment Table */}
                    <div className="flex flex-col gap-0">
                        <h3 className="font-semibold text-lg text-[#13000A] mb-4">Service & Payment</h3>
                        <div className="border border-gray-200 rounded-t-lg rounded-bl-lg overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-500 font-medium">
                                    <tr>
                                        <th className="px-6 py-3">
                                            <div className="flex items-center gap-1">S No <span className="text-[10px]">↕</span></div>
                                        </th>
                                        <th className="px-6 py-3">
                                            <div className="flex items-center gap-1">Service Name <span className="text-[10px]">↕</span></div>
                                        </th>
                                        <th className="px-6 py-3">
                                            <div className="flex items-center gap-1">Date/Time <span className="text-[10px]">↕</span></div>
                                        </th>
                                        <th className="px-6 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">Amount <span className="text-[10px]">↕</span></div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    <tr>
                                        <td className="px-6 py-4 text-gray-900">1</td>
                                        <td className="px-6 py-4 text-gray-900">Nail</td>
                                        <td className="px-6 py-4 text-gray-900">12 November, 09:00 AM</td>
                                        <td className="px-6 py-4 text-gray-900 text-right">$8.00</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 text-gray-900">2</td>
                                        <td className="px-6 py-4 text-gray-900">Facial</td>
                                        <td className="px-6 py-4 text-gray-900">12 November, 09:00 AM</td>
                                        <td className="px-6 py-4 text-gray-900 text-right">$24.99</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="flex flex-col md:flex-row justify-between items-start">
                            {/* Amount Paid */}
                            <div className="flex flex-col gap-4 mt-8">
                                <h3 className="font-semibold text-lg text-[#13000A]">Amount Paid</h3>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-[#FF4460] flex items-center justify-center text-white">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="2" y="5" width="20" height="14" rx="2" />
                                            <line x1="2" y1="10" x2="22" y2="10" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[#13000A]">Bank Account</p>
                                        <p className="text-gray-500 text-sm">******** 2345</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Totals */}
                            <div className="w-full md:w-1/3 border border-gray-200 rounded-b-lg border-t-0 -mt-px bg-white">
                                <div className="flex justify-between items-center px-6 py-3 border-b border-gray-200 bg-white">
                                    <span className="font-semibold text-gray-900">Sub Total</span>
                                    <span className="font-semibold text-gray-900">$32.99</span>
                                </div>
                                <div className="flex justify-between items-center px-6 py-3 border-b border-gray-200 bg-white">
                                    <span className="font-semibold text-gray-900">Platform Fee (15%)</span>
                                    <span className="font-semibold text-gray-900">$4.95</span>
                                </div>
                                <div className="flex justify-between items-center px-6 py-3 bg-white">
                                    <span className="font-bold text-gray-900 text-lg">Grand Total</span>
                                    <span className="font-bold text-gray-900 text-lg">$28.05</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Review */}
                    <div className="flex flex-col gap-4">
                        <h3 className="font-semibold text-lg text-[#13000A]">Review</h3>
                        <div className="flex gap-4">
                             <div className="w-12 h-12 relative rounded-xl overflow-hidden bg-gray-200 shrink-0">
                                <Image 
                                    src="/images/b5c17e81cc9828e32c3fa60901037d45d33375ec.jpg" 
                                    alt="Eleanor" 
                                    fill 
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-col gap-1 w-full">
                                <div className="flex items-center justify-between w-full">
                                    <h4 className="font-bold text-[#13000A]">Eleanor</h4>
                                    <span className="text-xs text-gray-400">2 days ago</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4].map((i) => (
                                        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#FDB022" stroke="none">
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                        </svg>
                                    ))}
                                     <svg width="14" height="14" viewBox="0 0 24 24" fill="#D0D5DD" stroke="none">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                    </svg>
                                </div>
                                <p className="text-gray-400 text-sm mt-1">
                                    The place was clean, great serivce, stall are friendly. I will certainly recommend to my friends and visit again! :)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
