// API base URL - uses environment variable in production, localhost in development
// For Render: VITE_API_URL must be set during BUILD time
// Force rebuild: 2026-02-06 - Fixed operator precedence bug
export const API_BASE_URL = import.meta.env.VITE_API_URL
  || (import.meta.env.DEV
    ? 'http://localhost:3000/api/v1'
    : 'https://cybercrime-backend.onrender.com/api/v1');

// Log API URL to help debug
console.log('🔗 API Base URL:', API_BASE_URL);
console.log('🔧 VITE_API_URL env:', import.meta.env.VITE_API_URL);
console.log('🏗️ DEV mode:', import.meta.env.DEV);

// Helper function to build API URLs
export const apiUrl = (path: string) => {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // Ensure API_BASE_URL doesn't have trailing slash
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const fullUrl = `${baseUrl}/${cleanPath}`;

  // Log in development
  if (import.meta.env.DEV) {
    console.log('API Call:', fullUrl);
  }

  return fullUrl;
};

// Helper to get auth headers from localStorage
export function getAuthHeaders(): HeadersInit {
  const token =
    localStorage.getItem("admin_token") ||
    localStorage.getItem("investigator_token") ||
    localStorage.getItem("access_token");
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  } else {
    console.warn("⚠️ No authentication token found in localStorage. Available keys:", Object.keys(localStorage));
  }
  return headers;
}

// Authenticated fetch wrapper - automatically adds auth headers
export async function authFetch(path: string, init?: RequestInit): Promise<Response> {
  const authHeaders = getAuthHeaders();
  const mergedHeaders: HeadersInit = {
    ...authHeaders,
    ...(init?.headers || {}),
  };
  return fetch(apiUrl(path), {
    ...init,
    headers: mergedHeaders,
  });
}