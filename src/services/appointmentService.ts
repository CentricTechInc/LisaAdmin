import api from "@/utils/axios";

export const getAppointmentsBySalonId = async (salonId: number | string, page: number = 1) => {
  const response = await api.get(`/admin/getAppointmentsBySalonId`, {
    params: {
      salon_id: salonId,
      page,
    },
  });
  return response.data;
};
