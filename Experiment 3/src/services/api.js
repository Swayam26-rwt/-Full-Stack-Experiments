import axios from "axios";

export const api = axios.create({
  baseURL: "https://example.invalid/api",
  timeout: 5000
});

let currentAccessToken = null;
let refreshPromise = null;

export function setAccessToken(token) {
  currentAccessToken = token;
}

function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error("No refresh token");
  }

  // Demo refresh flow. A real application should call:
  // POST /auth/refresh with a secure HttpOnly refresh cookie.
  const username = refreshToken.split("-")[1] || "viewer";
  const roleMap = { admin: "admin", editor: "editor", viewer: "viewer" };
  const role = roleMap[username] || "viewer";

  const { createDemoToken, decodeToken } = await import("../utils/jwt");
  const token = createDemoToken({
    userId: username,
    name: username,
    role
  });

  localStorage.setItem("accessToken", token);
  currentAccessToken = token;
  return token;
}

api.interceptors.request.use((config) => {
  if (currentAccessToken) {
    config.headers.Authorization = `Bearer ${currentAccessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null;
          });
        }

        const newToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    }

    return Promise.reject(error);
  }
);
