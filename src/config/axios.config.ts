import axios from "axios";

export const apiClient = axios.create({
  // baseURL: import.meta.env.VITE_API_URL,
});

apiClient.interceptors.request.use(function (config) {
  // const access_token = useAuthStore.getState().access_token;

  // config.headers.Authorization = `Bearer ${access_token}`;

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // if (error.response.status === 401 || error.response.status === 403) {
    //   useAuthStore.getState().logout();
    // }

    return Promise.reject(error);
  }
);
