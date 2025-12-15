import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { GreetingHeader } from "@/components/layout/GreetingHeader";
import { AppImage } from "@/components/ui/AppImage";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { DualActionPill } from "@/components/ui/DualActionPill";
import { FilterPillBar } from "@/components/ui/FilterPillBar";
import { StatCard } from "@/components/ui/StatCard";
import {
  DemographicDonutCard,
  type DemographicSegment,
} from "@/components/ui/DemographicDonutCard";
import {
  AppointmentsBarChartCard,
  type BarSeries,
} from "@/components/ui/AppointmentsBarChartCard";

export default function IndexPage() {
  const [tab, setTab] = React.useState("professional");
  const customerSegments: DemographicSegment[] = [
    { id: "male", label: "Male", value: 317, color: "#FF4460" },
    { id: "female", label: "Female", value: 622, color: "#FFD1DB" },
  ];
  const professionalSegments: DemographicSegment[] = [
    { id: "male", label: "Male", value: 180, color: "#FF4460" },
    { id: "female", label: "Female", value: 420, color: "#FFD1DB" },
  ];
  const appointmentLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const appointmentSeries: BarSeries[] = [
    {
      id: "customer-spending",
      label: "Customer' Spending",
      data: [150000, 120000, 70000, 180000, 130000, 90000, 95000, 120000, 125000, 160000, 130000, 110000],
      color: "#FF4460",
    },
    {
      id: "professional-earning",
      label: "Professional' Earning",
      data: [110000, 90000, 65000, 130000, 95000, 75000, 80000, 90000, 70000, 120000, 115000, 95000],
      color: "#00C853",
    },
    {
      id: "platform-earning",
      label: "Platform Earning",
      data: [50000, 45000, 30000, 65000, 40000, 35000, 37000, 42000, 38000, 60000, 50000, 45000],
      color: "#000000",
    },
  ];

  return (
    <div className="flex min-h-screen bg-(--color-surface)">
      <Sidebar activeId="appointments" />
      <main className="flex-1 px-2 py-2">
        <div className="w-full">
          <GreetingHeader userName="Alison" />

          <div className="mt-6 flex justify-center">
            <FilterPillBar
              items={[
                {
                  id: "customers",
                  label: "Customers",
                  items: [
                    {
                      id: "all-customers",
                      label: "All Customers",
                      onSelect: () => {
                        console.log("All Customers");
                      },
                    },
                    {
                      id: "new-customers",
                      label: "New Customers",
                      onSelect: () => {
                        console.log("New Customers");
                      },
                    },
                  ],
                },
                {
                  id: "range",
                  label: "Weekly",
                  items: [
                    {
                      id: "daily",
                      label: "Daily",
                      onSelect: () => {
                        console.log("Daily");
                      },
                    },
                    {
                      id: "weekly",
                      label: "Weekly",
                      onSelect: () => {
                        console.log("Weekly");
                      },
                    },
                    {
                      id: "monthly",
                      label: "Monthly",
                      onSelect: () => {
                        console.log("Monthly");
                      },
                    },
                  ],
                },
                {
                  id: "categories",
                  label: "All Categories",
                  items: [
                    {
                      id: "all-categories",
                      label: "All Categories",
                      onSelect: () => {
                        console.log("All Categories");
                      },
                    },
                    {
                      id: "hair",
                      label: "Hair",
                      onSelect: () => {
                        console.log("Hair");
                      },
                    },
                    {
                      id: "skin",
                      label: "Skin",
                      onSelect: () => {
                        console.log("Skin");
                      },
                    },
                  ],
                },
              ]}
            />
          </div>

          <div className="mt-6 flex justify-center">
            <StatCard label="Total Customers" value={939} />
          </div>

          <div className="mt-6">
            <AppointmentsBarChartCard
              title="Number Of Appointments"
              rangeLabel="Year"
              labels={appointmentLabels}
              series={appointmentSeries}
            />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <DemographicDonutCard
              title="Customer Demographics"
              totalLabel="Total Customer"
              totalValue={939}
              segments={customerSegments}
            />
            <DemographicDonutCard
              title="Professional Demographics"
              totalLabel="Total Professional"
              totalValue={600}
              segments={professionalSegments}
            />
          </div>

          <div className="mt-6 flex justify-center">
            <SegmentedControl
              value={tab}
              onChange={setTab}
              options={[
                { id: "personal", label: "Personal Info" },
                { id: "professional", label: "Professional Info" }
              ]}
            />
          </div>

          <div className="mt-6 flex justify-center">
            <AppImage
              imageName="image1.jpg"
              alt="Profile"
              width={160}
              height={160}
            />
          </div>

          <div className="mt-6 flex justify-center">
            <DualActionPill
              leftLabel="Discard"
              rightLabel="Add"
              active="right"
              onLeftClick={() => {
                console.log("Discard clicked");
              }}
              onRightClick={() => {
                console.log("Add clicked");
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
