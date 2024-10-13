import axios from "axios";
import { cookies } from "next/headers";

const x_axios = axios.create({
  baseURL: process.env.API_URL,
  timeout: 0,
  withCredentials: true,
});

x_axios.interceptors.request.use(
  (config) => {
    const token = cookies().get("jwt")?.value;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

x_axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      cookies().delete("jwt");
      cookies().delete("profile");
    }

    return Promise.reject(error);
  }
);

export default x_axios;
