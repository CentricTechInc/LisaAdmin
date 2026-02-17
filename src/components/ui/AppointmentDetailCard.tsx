import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ReviewCard } from "@/components/ui/ReviewCard";
import { cn } from "@/lib/utils";

export interface AppointmentDetailData {
  status: string;
  customer: {
    name: string;
    email: string;
    image: string;
  };
  professional: {
    name: string;
    category: string;
    phone: string;
    email: string;
    image: string;
  };
  notes: string;
  dateTime: string;
  services: Array<{
    sNo: number;
    name: string;
    dateTime: string;
    amount: string;
  }>;
  payment: {
    method: string;
    last4: string;
    subTotal: string;
    platformFee: string;
    grandTotal: string;
  };
  review?: {
    name: string;
    date: string;
    rating: number;
    comment: string;
    image: string;
  };
}

interface AppointmentDetailCardProps {
  data: AppointmentDetailData;
  backLink?: string;
  onBack?: () => void;
  className?: string;
}

export const AppointmentDetailCard: React.FC<AppointmentDetailCardProps> = ({
  data,
  backLink = "/customers/profile",
  onBack,
  className,
}) => {
  const getStatusColor = (status: string) => {
    // Safely convert status to string and lowercase
    const normalizedStatus = String(status || "").toLowerCase();
    
    switch (normalizedStatus) {
      case "completed":
        return "bg-[#E6F6EC] text-[#039855]";
      case "pending":
        return "bg-[#FFF0F4] text-[#FF4460]"; // Pink for pending
      case "cancelled":
        return "bg-[#F2F4F7] text-[#344054]"; // Gray for cancelled
      default:
        return "bg-[#F9FAFB] text-[#344054]"; // Gray default
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center justify-center w-10 h-10 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
              aria-label="Back"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          ) : (
            <Link
              href={backLink}
              className="flex items-center justify-center w-10 h-10 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
              aria-label="Back"
            >
              <Image
                src="/icons/BackButton.png" // Assuming this icon exists, otherwise I'll need to check or use a generic one
                alt="Back"
                width={20}
                height={20}
                className="" // If arrow-left points left, this is fine. Wait, usually arrow-left points left.
              />
            </Link>
          )}
          <h1 className="text-2xl font-bold text-[#13000A]">Detail</h1>
        </div>
        <div className={cn("px-4 py-1.5 text-sm font-medium rounded-md", getStatusColor(data.status))}>
          {data.status}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-8">
        {/* Customer & Professional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Customer Info */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-lg text-[#13000A]">
              Customer Information
            </h3>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 relative rounded-xl overflow-hidden bg-gray-200 shrink-0">
                <Image
                  src={data.customer.image}
                  alt={data.customer.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#13000A]">
                  {data.customer.name}
                </h2>
                <p className="text-gray-500">{data.customer.email}</p>
              </div>
            </div>
          </div>

          {/* Professional Info */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-lg text-[#13000A]">
              Professional Information
            </h3>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 relative rounded-xl overflow-hidden bg-gray-200 shrink-0">
                <Image
                  src={data.professional.image}
                  alt={data.professional.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="text-[#FF4460] text-xs font-medium mb-1">
                  {data.professional.category}
                </div>
                <h2 className="text-xl font-bold text-[#13000A]">
                  {data.professional.name}
                </h2>
                <p className="text-gray-500">{data.professional.phone}</p>
                <p className="text-gray-500">{data.professional.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notes & Date */}
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-xl">
            <h3 className="font-semibold text-[#13000A]">Notes</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              {data.notes}
            </p>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <h3 className="font-semibold text-[#13000A]">Date & Time</h3>
            <p className="text-[#FF4460] font-medium">{data.dateTime}</p>
          </div>
        </div>

        {/* Service & Payment Table */}
        <div className="flex flex-col gap-0">
          <h3 className="font-semibold text-lg text-[#13000A] mb-4">
            Service & Payment
          </h3>
          <div className="border border-gray-200 rounded-t-lg rounded-bl-lg overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-3 w-[10%]">
                    <div className="flex items-center gap-1">
                      <Image src="/icons/sort.png" alt="sort" width={10} height={10} /> S No
                    </div>
                  </th>
                  <th className="px-6 py-3 w-[40%]">
                    <div className="flex items-center gap-1">
                      <Image src="/icons/sort.png" alt="sort" width={10} height={10} /> Service Name
                    </div>
                  </th>
                  <th className="px-6 py-3 w-[30%]">
                    <div className="flex items-center gap-1">
                      <Image src="/icons/sort.png" alt="sort" width={10} height={10} /> Date/Time
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right w-[20%]">
                    <div className="flex items-center justify-end gap-1">
                      <Image src="/icons/sort.png" alt="sort" width={10} height={10} /> Amount
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.services.map((service) => (
                  <tr key={service.sNo}>
                    <td className="px-6 py-4 text-gray-900">{service.sNo}</td>
                    <td className="px-6 py-4 text-gray-900">{service.name}</td>
                    <td className="px-6 py-4 text-gray-900">
                      {service.dateTime}
                    </td>
                    <td className="px-6 py-4 text-gray-900 text-right">
                      {service.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start">
            {/* Amount Paid */}
            <div className="flex flex-col gap-4 mt-8">
              <h3 className="font-semibold text-lg text-[#13000A]">
                Amount Paid
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#FF4460] flex items-center justify-center text-white">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-[#13000A]">
                    {data.payment.method}
                  </p>
                  <p className="text-gray-500 text-sm">
                    ******** {data.payment.last4}
                  </p>
                </div>
              </div>
            </div>

            {/* Totals */}
            <div className="w-full md:w-1/2 border border-gray-200 rounded-b-lg border-t-0 -mt-px bg-white">
              <div className="flex justify-between items-center px-6 py-3 border-b border-gray-200 bg-white">
                <span className="font-semibold text-gray-900">Sub Total</span>
                <span className="font-semibold text-gray-900">
                  {data.payment.subTotal}
                </span>
              </div>
              <div className="flex justify-between items-center px-6 py-3 border-b border-gray-200 bg-white">
                <span className="font-semibold text-gray-900">
                  Platform Fee (15%)
                </span>
                <span className="font-semibold text-gray-900">
                  {data.payment.platformFee}
                </span>
              </div>
              <div className="flex justify-between items-center px-6 py-3 bg-white">
                <span className="font-bold text-gray-900 text-lg">
                  Grand Total
                </span>
                <span className="font-bold text-gray-900 text-lg">
                  {data.payment.grandTotal}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Review */}
        {data.review && (
          <ReviewCard
            title="Review"
            name={data.review.name}
            date={data.review.date}
            rating={data.review.rating}
            comment={data.review.comment}
            image={data.review.image}
          />
        )}
      </div>
    </div>
  );
};
