import axios from "axios";

export const apiClient = axios.create({
  // baseURL: import.meta.env.VITE_API_URL,
});

// let refreshTokenPromise: Promise<string> | null = null;

// const refreshToken = async () => {
//   try {
//     const refresh_token = useAuthStore.getState().refresh_token;

//     const { data } = await axios.post(
//       import.meta.env.VITE_API_URL + "/auth/refresh",
//       null,
//       {
//         headers: {
//           Authorization: `Bearer ${refresh_token}`,
//         },
//       }
//     );

//     useAuthStore.getState().refreshAccessToken(data.token);

//     return data.token;
//   } catch (e) {
//     console.error("Refresh token failed", e);
//     useAuthStore.getState().logout();
//     throw e;
//   } finally {
//     refreshTokenPromise = null;
//   }
// };

apiClient.interceptors.request.use(function (config) {
  // const access_token = useAuthStore.getState().access_token;

  // config.headers.Authorization = `Bearer ${access_token}`;

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // if (error.response.status === 401 || error.response.status === 403) {
    //   if (!refreshTokenPromise) {
    //     refreshTokenPromise = refreshToken();
    //   }

    //   const newAccessToken = await refreshTokenPromise;

    //   error.config.headers.Authorization = `Bearer ${newAccessToken}`;
    // }

    return Promise.reject(error);
  }
);
