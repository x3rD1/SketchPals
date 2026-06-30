const BASE_URL = import.meta.env.VITE_API_URL;

let refreshPromise: Promise<Response> | null = null;

function buildOptions(
  method: string,
  data: BodyInit | null | undefined,
): RequestInit {
  const isFormData = data instanceof FormData;

  return {
    method,
    body: isFormData ? data : JSON.stringify({ title: data }),
    headers: isFormData ? undefined : { "Content-Type": "application/json" },
  };
}

async function request(url: string, options = {}) {
  let res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    credentials: "include",
  });

  if (res.status === 401) {
    if (!refreshPromise) {
      refreshPromise = fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
    }

    const refresh = await refreshPromise;

    if (!refresh.ok) throw new Error("Unauthorized");

    refreshPromise = null;

    res = await fetch(`${BASE_URL}${url}`, {
      ...options,
      credentials: "include",
    });
  }

  return res.json();
}

export const api = {
  get: (url: string) => request(url, { method: "GET" }),
  post: (url: string) => request(url, { method: "POST" }),
  patch: (url: string, data: BodyInit | null | undefined) =>
    request(url, buildOptions("PATCH", data)),
};
