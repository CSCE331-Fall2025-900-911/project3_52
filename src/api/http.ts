import { API_BASE_URL } from "./configure";
export { API_BASE_URL };

export const apiFetch = (endpoint: string, options: RequestInit = {}) =>
  fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });

export const kioskApiFetch = (endpoint: string, options: RequestInit = {}) =>
  fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
