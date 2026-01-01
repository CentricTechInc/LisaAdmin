import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  message: string;
}

export interface ApiError {
  status?: number;
  message: string;
  data?: unknown;
}

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000/api",
  timeout: 15000,
  withCredentials: false,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse<ApiResponse> => {
    const { status, data, statusText } = response;

    let message = statusText || "Request completed";

    if (status === 200) {
      message = "Request successful";
    } else if (status >= 200 && status < 300) {
      message = statusText || "Request successful";
    }

    const apiResponse: ApiResponse = {
      data,
      status,
      message,
    };

    return {
      ...response,
      data: apiResponse,
    };
  },
  (error: AxiosError): Promise<never> => {
    const status = error.response?.status;
    // Try to get the actual error message from backend response
    const data = error.response?.data as any;

    let message = "Unexpected error. Please try again.";

    if (data?.message) {
      if (Array.isArray(data.message)) {
        message = data.message.join(", ");
      } else {
        message = data.message;
      }
    } else if (data?.error) {
      message = typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
    } else if (typeof data === 'string') {
      message = data;
    } else if (status === 400) {
      message = error.response?.statusText || "Request is invalid. Please check your input.";
    } else if (status === 500) {
      message = error.response?.statusText || "Server error. Please try again later.";
    } else if (status) {
      message = error.response?.statusText || `Request failed with status ${status}`;
    } else if (error.message === "Network Error") {
      message = "Network error. Please check your connection.";
    }

    const apiError: ApiError = {
      status,
      message,
      data,
    };

    return Promise.reject(apiError);
  }
);

export default api;

