const BACKEND_URL = "https://fullstack-real-estate-platform-wjnr.vercel.app";
const configuredApiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_PUBLIC_API_URL;

// Always fallback to live backend URL in production and dev if env var is not provided
export const API_URL = (configuredApiUrl || `${BACKEND_URL}/api`).replace(/\/$/, "");

export const API_ORIGIN = API_URL.startsWith("http")
  ? API_URL.replace(/\/api\/?$/, "")
  : BACKEND_URL;

// Vercel Functions do not provide a persistent Socket.IO server. Configure this
// only when the realtime server is deployed separately (Render, Railway, etc.).
export const SOCKET_URL = (import.meta.env.VITE_SOCKET_URL || API_ORIGIN).replace(/\/$/, "");

export const resolveAssetUrl = (assetPath) => {
  if (!assetPath) return null;
  if (/^https?:\/\//i.test(assetPath) || assetPath.startsWith("data:")) {
    return assetPath;
  }

  return `${API_ORIGIN}${assetPath.startsWith("/") ? "" : "/"}${assetPath}`;
};
