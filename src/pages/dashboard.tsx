import React, { useEffect, useState } from "react";
import { StatCard } from "@/components/ui/StatCard";
import {
  DemographicDonutCard,
  type DemographicSegment,
} from "@/components/ui/DemographicDonutCard";
import {
  AppointmentsBarChartCard,
  type BarSeries,
} from "@/components/ui/AppointmentsBarChartCard";
import api from "@/utils/axios";

// Interfaces for API response
interface DashboardStats {
  totalCustomers: number;
  totalProfessionals: number;
  activeBookings: number;
  totalRevenue: number;
}

interface MonthlyStat {
  month: string;
  customerSpending: number;
  professionalEarning: number;
  platformEarning: number;
}

interface DemographicBreakdown {
  [key: string]: number;
}

interface DemographicData {
  total: number;
  breakdown: DemographicBreakdown;
}

interface DashboardData {
  stats: DashboardStats;
  charts: {
    monthlyStats: MonthlyStat[];
    customerDemographics: DemographicData;
    professionalDemographics: DemographicData;
  };
}

export default function DashboardPage() {
  const [rangeLabel, setRangeLabel] = React.useState("Yearly");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const year = 2026; // Default to 2026 as per user request
        const response = await api.get('/admin/dashboard/stats', {
          params: { year }
        });
        
        // response.data is the ApiResponse wrapper
        // response.data.data is the actual backend response body { status: true, data: ... }
        if (response.data.data?.status && response.data.data?.data) {
          setData(response.data.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Prepare Chart Data
  const appointmentLabels = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const monthlyStats = data?.charts.monthlyStats || [];

  // Helper to get data array ensuring 12 months order matches labels if needed, 
  // but assuming API returns sorted Jan-Dec or we just map index.
  // The API example shows "month": "Jan", etc. so we can map directly if they are in order.
  // We'll assume the API returns them in order Jan-Dec.
  
  const getSeriesData = (key: keyof MonthlyStat) => {
    if (!data) return new Array(12).fill(0);
    return data.charts.monthlyStats.map(stat => Number(stat[key]) || 0);
  };

  const appointmentSeries: BarSeries[] = [
    {
      id: "customer-spending",
      label: "Customer’ Spending",
      data: getSeriesData("customerSpending"),
      color: "#FF4460",
    },
    {
      id: "professional-earning",
      label: "Professional’ Earning",
      data: getSeriesData("professionalEarning"),
      color: "#00C853",
    },
    {
      id: "platform-earning",
      label: "Platform Earning",
      data: getSeriesData("platformEarning"),
      color: "#000000",
    },
  ];

  // Prepare Customer Demographics
  const customerTotal = data?.charts.customerDemographics.total || 0;
  const customerBreakdown = data?.charts.customerDemographics.breakdown || { male: 0, female: 0 };
  
  const customerSegments: DemographicSegment[] = [
    { 
      id: "male", 
      label: `Male: ${customerBreakdown["male"] || 0}`, 
      value: customerBreakdown["male"] || 0, 
      color: "#FF4460" 
    },
    { 
      id: "female", 
      label: `Female: ${customerBreakdown["female"] || 0}`, 
      value: customerBreakdown["female"] || 0, 
      color: "#FFD1DB" 
    },
  ];

  // Prepare Professional Demographics
  const professionalTotal = data?.charts.professionalDemographics.total || 0;
  const professionalBreakdown = data?.charts.professionalDemographics.breakdown || { salon: 0, individual: 0 };

  const professionalSegments: DemographicSegment[] = [
    { 
      id: "salon", 
      label: `Salon: ${professionalBreakdown["salon"] || 0}`, 
      value: professionalBreakdown["salon"] || 0, 
      color: "#00C853" 
    },
    { 
      id: "individual", 
      label: `Individual Service Providers: ${professionalBreakdown["individual"] || 0}`, 
      value: professionalBreakdown["individual"] || 0, 
      color: "#C8E6C9" 
    },
  ];

  if (loading) {
    return <div className="w-full h-96 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          label="Total Customers" 
          value={data?.stats.totalCustomers || 0} 
          className="h-32" 
        />
        <StatCard 
          label="Total Professionals" 
          value={data?.stats.totalProfessionals || 0} 
          className="h-32" 
        />
        <StatCard 
          label="Active Bookings" 
          value={data?.stats.activeBookings || 0} 
          className="h-32" 
        />
        <StatCard 
          label="Total Revenue" 
          value={`$${data?.stats.totalRevenue || 0}`} 
          className="h-32" 
        />
      </div>

      {/* Bar Chart Section */}
      <div className="w-full">
        <AppointmentsBarChartCard
          title="Number Of Appointments"
          rangeLabel={rangeLabel}
          onRangeChange={setRangeLabel}
          labels={appointmentLabels}
          series={appointmentSeries}
          className="min-h-100"
        />
      </div>

      {/* Donut Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DemographicDonutCard
          title="Customer Demographics"
          totalLabel="Total Customer"
          totalValue={customerTotal}
          segments={customerSegments}
          className="min-h-87.5"
        />
        <DemographicDonutCard
          title="Professional Demographics"
          totalLabel="Total Professionals"
          totalValue={professionalTotal}
          segments={professionalSegments}
          className="min-h-87.5"
        />
      </div>
    </div>
  );
}
