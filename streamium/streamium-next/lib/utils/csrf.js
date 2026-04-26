import { CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from "@/lib/constants/security";

function getCookie(name) {
  if (typeof document === "undefined") return null;

  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = document.cookie.match(new RegExp(`(?:^|; )${escapedName}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function getCsrfToken() {
  return getCookie(CSRF_COOKIE_NAME);
}

export function withCsrfHeaders(init = {}) {
  const token = getCsrfToken();
  if (!token) return init;

  const headers = new Headers(init.headers ?? {});
  headers.set(CSRF_HEADER_NAME, token);

  return {
    ...init,
    headers,
  };
}

export async function csrfFetch(input, init = {}) {
  const method = (init.method ?? "GET").toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") {
    return fetch(input, init);
  }

  return fetch(input, withCsrfHeaders(init));
}
