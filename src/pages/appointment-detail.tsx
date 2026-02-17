import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { AppointmentDetailCard, AppointmentDetailData } from "@/components/ui/AppointmentDetailCard";
import api from "@/utils/axios";

// Define the API response types based on example.json
interface ApiService {
  name: string;
  price: string;
  date: string;
}

interface ApiCustomer {
  name: string;
  email: string;
  picture: string;
}

interface ApiProfessional {
  name: string;
  email: string;
  phone: string;
  address: string;
  picture: string;
}

interface ApiPayment {
  sub_total: number;
  platform_fee: string;
  grand_total: string;
  method: string;
  last_digits: string;
}

interface ApiReview {
    name: string;
    date: string;
    rating: number;
    comment?: string;
    review?: string;
    message?: string;
    description?: string;
    image: string;
}

interface ApiAppointmentData {
  id: number;
  status: string;
  date_time: string;
  notes: string;
  customer: ApiCustomer;
  professional: ApiProfessional;
  services: ApiService[];
  payment: ApiPayment;
  review: ApiReview | null;
}

interface BackendResponse {
    status: boolean;
    message: string;
    data: ApiAppointmentData;
}

export default function AppointmentDetail() {
  const router = useRouter();
  const { id, source } = router.query;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AppointmentDetailData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activeSidebarId = (typeof source === "string" && ["customers", "professionals", "appointments"].includes(source))
    ? source
    : "customers"; // Default or fallback

  useEffect(() => {
    if (!router.isReady) return;

    if (!id) {
        setLoading(false);
        return;
    }

    const fetchAppointment = async () => {
      try {
        setLoading(true);
        setError(null);
        // API endpoint: /api/admin/getAppointmentbyId/{id}
        // Assuming axios baseURL is configured, we use /admin/getAppointmentbyId/{id}
        const response = await api.get(`/admin/getAppointmentbyId/${id}`);
        
        // The API returns { status: boolean, message: string, data: { ... } }
        const backendResponse = response.data.data as unknown as BackendResponse;
        console.log("Appointment Detail Response:", backendResponse);

        if (backendResponse.status) {
            const apiData: ApiAppointmentData = backendResponse.data;

            // Map API data to component data
            const mappedData: AppointmentDetailData = {
              status: String(apiData.status || "Unknown"),
              customer: {
                name: apiData.customer?.name || "Unknown",
                email: apiData.customer?.email || "",
                image: apiData.customer?.picture || "/images/avatar.png",
              },
              professional: {
                name: apiData.professional?.name || "Unknown",
                category: "Professional", // Default value as API doesn't provide it
                phone: apiData.professional?.phone || "",
                email: apiData.professional?.email || "",
                image: apiData.professional?.picture || "/images/avatar.png",
              },
              notes: apiData.notes || "",
              dateTime: apiData.date_time || "",
              services: apiData.services?.map((service, index) => ({
                sNo: index + 1,
                name: service.name || "Unknown Service",
                dateTime: service.date || "", 
                amount: service.price || "0",
              })) || [],
              payment: {
                method: apiData.payment?.method || "",
                last4: apiData.payment?.last_digits || "",
                subTotal: apiData.payment?.sub_total?.toString() || "0",
                platformFee: apiData.payment?.platform_fee || "0",
                grandTotal: apiData.payment?.grand_total || "0",
              },
              review: apiData.review ? {
                  name: apiData.review.name || "Unknown",
                  date: apiData.review.date || "",
                  rating: apiData.review.rating || 0,
                  comment: apiData.review.comment || apiData.review.review || apiData.review.message || apiData.review.description || "",
                  image: apiData.review.image || "/images/avatar.png"
              } : undefined,
            };

            setData(mappedData);
        } else {
            setError(response.data.message || "Failed to retrieve appointment details");
        }
      } catch (err: any) {
        console.error("Failed to fetch appointment details:", err);
        setError(err.message || "Failed to load appointment details");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [id, router.isReady]);


  return (
    <div className="w-full flex flex-col gap-6">
      <Head>
        <title>Appointment Detail | Lisa Admin</title>
      </Head>
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
         <div className="flex items-center justify-center h-64 text-red-500">
            {error}
         </div>
      ) : data ? (
        <AppointmentDetailCard
            data={data}
            onBack={() => {
              if (typeof window !== "undefined" && window.history.length > 1) router.back();
              else router.push(`/${activeSidebarId}`);
            }}
          />
      ) : (
          <div className="flex items-center justify-center h-64">
            No appointment data found.
          </div>
      )}
    </div>
  );
}
