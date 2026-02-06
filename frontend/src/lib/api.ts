// API base URL - uses environment variable in production, localhost in development
// For Render: VITE_API_URL must be set during BUILD time
// Force rebuild: 2026-02-06
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// Log API URL in development to help debug
if (import.meta.env.DEV) {
  console.log('API Base URL:', API_BASE_URL);
  console.log('VITE_API_URL env:', import.meta.env.VITE_API_URL);
}

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
