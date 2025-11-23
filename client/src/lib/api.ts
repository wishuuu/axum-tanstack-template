import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

const baseURL = import.meta.env.DEV ? "https://localhost:42069/api" : "/api";

const apiClient: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

const api = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig) => apiClient.get<T, AxiosResponse<T>>(url, config),

  post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.post<T, AxiosResponse<T>>(url, data, config),

  put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.put<T, AxiosResponse<T>>(url, data, config),

  patch: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.patch<T, AxiosResponse<T>>(url, data, config),

  delete: <T = unknown>(url: string, config?: AxiosRequestConfig) => apiClient.delete<T, AxiosResponse<T>>(url, config),

  axiosInstance: apiClient,
};

export default api;
