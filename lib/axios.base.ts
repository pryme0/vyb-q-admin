import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const authStorage: any = localStorage.getItem("admin-auth-storage");
    const parsedStorage = authStorage && JSON.parse(authStorage)?.state;

    if (parsedStorage && parsedStorage.accessToken) {
      config.headers.Authorization = `Bearer ${
        parsedStorage.accessToken || ""
      }`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
