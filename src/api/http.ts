export const BACKEND_URL = "http://127.0.0.1:5000";
export const KIOSK_API_KEY = "my_secret_kiosk_password_12345";

export const apiFetch = (endpoint: string, options: RequestInit = {}) =>
  fetch(`${BACKEND_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });

export const kioskApiFetch = (endpoint: string, options: RequestInit = {}) =>
  fetch(`${BACKEND_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": KIOSK_API_KEY,
      ...(options.headers || {}),
    },
  });