import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { GreetingHeader } from "@/components/layout/GreetingHeader";
import { StatCard } from "@/components/ui/StatCard";
import {
  DemographicDonutCard,
  type DemographicSegment,
} from "@/components/ui/DemographicDonutCard";
import {
  AppointmentsBarChartCard,
  type BarSeries,
} from "@/components/ui/AppointmentsBarChartCard";

export default function DashboardPage() {
  // Data for Bar Chart
  const appointmentLabels = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const appointmentSeries: BarSeries[] = [
    {
      id: "customer-spending",
      label: "Customer’ Spending",
      data: [150000, 120000, 90000, 180000, 140000, 65000, 110000, 125000, 90000, 160000, 130000, 110000],
      color: "#FF4460",
    },
    {
      id: "professional-earning",
      label: "Professional’ Earning",
      data: [115000, 95000, 70000, 140000, 110000, 50000, 85000, 100000, 70000, 125000, 100000, 85000],
      color: "#00C853",
    },
    {
      id: "platform-earning",
      label: "Platform Earning",
      data: [60000, 45000, 35000, 70000, 55000, 25000, 45000, 50000, 35000, 65000, 50000, 45000],
      color: "#000000",
    },
  ];

  // Data for Customer Demographics
  const customerSegments: DemographicSegment[] = [
    { id: "male", label: "Male: 317", value: 317, color: "#FF4460" },
    { id: "female", label: "Female: 622", value: 622, color: "#FFD1DB" },
  ];

  // Data for Professional Demographics
  const professionalSegments: DemographicSegment[] = [
    { id: "salon", label: "Salon: 123", value: 123, color: "#00C853" },
    { id: "individual", label: "Individual Service Providers: 112", value: 112, color: "#C8E6C9" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]" suppressHydrationWarning>
      <Sidebar activeId="dashboard" />
      <main className="flex-1 p-2 overflow-y-auto">
        <div className="w-full flex flex-col gap-6">
          {/* Header */}
          <GreetingHeader userName="Alison" />

          {/* Stats Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Customers" value={939} className="h-32" />
            <StatCard label="Total Professionals" value={235} className="h-32" />
            <StatCard label="Active Bookings" value={50} className="h-32" />
            <StatCard label="Total Revenue" value="$15154" className="h-32" />
          </div>

          {/* Bar Chart Section */}
          <div className="w-full">
            <AppointmentsBarChartCard
              title="Number Of Appointments"
              rangeLabel="Year"
              labels={appointmentLabels}
              series={appointmentSeries}
              className="min-h-[400px]"
            />
          </div>

          {/* Donut Charts Row */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <DemographicDonutCard
              title="Customer Demographics"
              totalLabel="Total Customer"
              totalValue={939}
              segments={customerSegments}
              className="min-h-[350px]"
            />
            <DemographicDonutCard
              title="Professional Demographics"
              totalLabel="Total Professionals"
              totalValue={235}
              segments={professionalSegments}
              className="min-h-[350px]"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
