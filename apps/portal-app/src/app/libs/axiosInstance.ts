import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosHeaders, AxiosError } from "axios";
import { ACCESS_TOKEN_KEY } from "./constants";
// import { toast } from "react-toastify";

const axiosInstance: AxiosInstance = axios.create();

axiosInstance.interceptors.request.use((request: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('ACCESS_TOKEN_KEY');

  if (token) {
    if (request.headers instanceof AxiosHeaders) {
      request.headers.set('Authorization', `Bearer ${token}`);
    } else {
      request.headers = new AxiosHeaders({
        Authorization: `Bearer ${token}`,
      });
    }
  }

  return request;
});

axiosInstance.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    const token = localStorage.getItem('ACCESS_TOKEN_KEY');
    if (error.response && (error.response.status === 401) && token) {
      handleSessionExpired();
    }
    return Promise.reject(error);
  }
);

const handleSessionExpired = () => {
  // toast.error("Session Expired. Please login again.");
  localStorage.removeItem('ACCESS_TOKEN_KEY');
  window.location.href = "/";
};

export default axiosInstance;
