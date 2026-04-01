import api from "@/utils/axios";

export type AppNotification = {
  time: string;
  id: number;
  subject: string;
  message: string;
  modelType: string | null;
  modelId: number | null;
  notifiedTo: number | string;
  isRead: boolean;
  createdAt: string;
};

type NotificationsPayload = {
  unReadCount: number;
  count: number;
  rows: AppNotification[];
};

type NotificationsBackendResponse = {
  status: boolean;
  message: string;
  data: NotificationsPayload;
};

export const getNotifications = async (page: number = 1): Promise<NotificationsPayload> => {
  const response = await api.get(`/notifications/${page}`);
  const backendResponse = response.data.data as unknown as NotificationsBackendResponse;

  if (backendResponse?.status && backendResponse?.data) {
    return backendResponse.data;
  }

  return { unReadCount: 0, count: 0, rows: [] };
};

type MarkAllReadBackendResponse = {
  status: boolean;
  message: string;
};

export const markAllNotificationsRead = async (): Promise<boolean> => {
  const response = await api.get(`/notifications/markAllRead`);
  const backendResponse = response.data.data as unknown as MarkAllReadBackendResponse;
  return !!backendResponse?.status;
};
