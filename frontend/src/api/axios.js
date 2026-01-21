import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(api(prom.request));
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // queue the request until refresh is done
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, request: originalRequest });
        });
      }

      isRefreshing = true;

      try {
        await api.post("/developers/refresh-token");

        // ✅ DISPATCH EVENT TO UPDATE AUTH CONTEXT
        window.dispatchEvent(new Event("token-refreshed"));

        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // ✅ CLEAR SESSION AND REDIRECT TO LOGIN
        window.dispatchEvent(new Event("auth-failed"));

        // Prevent infinite reload loop if already on login page
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;