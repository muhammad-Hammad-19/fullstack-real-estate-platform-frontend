const configuredApiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_PUBLIC_API_URL;

// Keep local development working while allowing a separate Vercel backend.
export const API_URL = (configuredApiUrl || (import.meta.env.DEV ? "https://fullstack-real-estate-platform-wjnr.vercel.app/api" : "/api")).replace(/\/$/, "");

export const API_ORIGIN = API_URL.startsWith("http")
  ? API_URL.replace(/\/api\/?$/, "")
  : "";

// Vercel Functions do not provide a persistent Socket.IO server. Configure this
// only when the realtime server is deployed separately (Render, Railway, etc.).
export const SOCKET_URL = (import.meta.env.VITE_SOCKET_URL || (import.meta.env.DEV ? API_ORIGIN : "")).replace(/\/$/, "");

export const resolveAssetUrl = (assetPath) => {
  if (!assetPath) return null;
  if (/^https?:\/\//i.test(assetPath) || assetPath.startsWith("data:")) {
    return assetPath;
  }

  return `${API_ORIGIN}${assetPath.startsWith("/") ? "" : "/"}${assetPath}`;
};
