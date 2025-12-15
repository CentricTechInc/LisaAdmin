import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { GreetingHeader } from "@/components/layout/GreetingHeader";
import { AppImage } from "@/components/ui/AppImage";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { DualActionPill } from "@/components/ui/DualActionPill";
import { FilterPillBar } from "@/components/ui/FilterPillBar";
import { StatCard } from "@/components/ui/StatCard";
import { FormInput } from "@/components/ui/FormInput";
import { FormTextarea } from "@/components/ui/FormTextarea";
import { FileUpload } from "@/components/ui/FileUpload";
import { Checkbox } from "@/components/ui/Checkbox";
import { DaySelector } from "@/components/ui/DaySelector";
import { Button } from "@/components/ui/Button";
import {
  DemographicDonutCard,
  type DemographicSegment,
} from "@/components/ui/DemographicDonutCard";
import {
  AppointmentsBarChartCard,
  type BarSeries,
} from "@/components/ui/AppointmentsBarChartCard";

export default function DashboardPage() {
  const [tab, setTab] = React.useState("professional");
  const [selectedDays, setSelectedDays] = React.useState<string[]>(["mon", "wed", "fri"]);
  const [entityFilter, setEntityFilter] = React.useState("All");
  const [timeFilter, setTimeFilter] = React.useState("Weekly");

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
      <Sidebar activeId="dashboard" />
      <main className="flex-1 px-2 py-2">
        <div className="w-full">
          <GreetingHeader userName="Alison" />

          <div className="mt-6 flex justify-center">
            <FilterPillBar
              items={[
                {
                  id: "entity-type",
                  label: entityFilter,
                  items: [
                    {
                      id: "all",
                      label: "All",
                      onSelect: () => setEntityFilter("All"),
                    },
                    {
                      id: "customer",
                      label: "Customer",
                      onSelect: () => setEntityFilter("Customer"),
                    },
                    {
                      id: "salon",
                      label: "Salon",
                      onSelect: () => setEntityFilter("Salon"),
                    },
                    {
                      id: "individual-professionals",
                      label: "Individual Professionals",
                      onSelect: () => setEntityFilter("Individual Professionals"),
                    },
                  ],
                },
                {
                  id: "range",
                  label: timeFilter,
                  items: [
                    {
                      id: "today",
                      label: "Today",
                      onSelect: () => setTimeFilter("Today"),
                    },
                    {
                      id: "weekly",
                      label: "Weekly",
                      onSelect: () => setTimeFilter("Weekly"),
                    },
                    {
                      id: "bi-weekly",
                      label: "Bi-Weekly",
                      onSelect: () => setTimeFilter("Bi-Weekly"),
                    },
                    {
                      id: "monthly",
                      label: "Monthly",
                      onSelect: () => setTimeFilter("Monthly"),
                    },
                    {
                      id: "yearly",
                      label: "Yearly",
                      onSelect: () => setTimeFilter("Yearly"),
                    },
                  ],
                },
                {
                  id: "categories",
                  label: "All Categories",
                  items: [],
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

          <div className="mt-8 grid gap-6 rounded-xl border border-[color-mix(in_oklab,var(--color-muted)_70%,transparent)] bg-white p-6">
            <h2 className="text-lg font-semibold">Form Components Demo</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <FormInput
                label="License Type"
                placeholder="Barber"
              />
              <div className="flex items-end">
                 <Checkbox
                   label="Hairstyling"
                   defaultChecked
                 />
              </div>
            </div>

            <FormTextarea
              label="Bio/Headline"
              placeholder="Bloom & Blade salon, established in 2003..."
              defaultValue="Bloom & Blade salon, established in 2003 in Celina, Delaware, prides itself on delivering exceptional service at a fair price. Our dedicated team is committed to making every visit a delightful experience, ensuring that you leave feeling refreshed and beautiful. We believe in creating a welcoming atmosphere where every client feels valued."
            />

            <FileUpload
              label="License/Certificate"
              fileName="License Photo.jpeg"
              onDownload={() => console.log("Download")}
              onDelete={() => console.log("Delete")}
            />

            <div>
              <label className="mb-2 block text-sm text-[color-mix(in_oklab,var(--color-foreground)_85%,transparent)]">
                Working Days
              </label>
              <DaySelector
                selectedDays={selectedDays}
                onChange={setSelectedDays}
              />
            </div>

            <div className="mt-4 flex justify-end">
              <Button variant="brand" shape="pill" size="lg" className="w-40 text-lg font-bold">
                Add
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
