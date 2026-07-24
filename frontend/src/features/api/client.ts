type JsonBody = Record<string, unknown>;

let refreshPromise: Promise<Response> | null = null;

function buildOptions(
  method: string,
  data: FormData | JsonBody | object = {},
): RequestInit {
  const isFormData = data instanceof FormData;

  return {
    method,
    body: isFormData ? data : JSON.stringify(data),
    headers: isFormData ? undefined : { "Content-Type": "application/json" },
  };
}

async function request(url: string, options = {}) {
  let res = await fetch(`/api${url}`, {
    ...options,
    credentials: "include",
  });

  if (res.status === 401) {
    if (!refreshPromise) {
      refreshPromise = fetch(`/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
    }

    try {
      const refresh = await refreshPromise;

      if (!refresh.ok) throw new Error("Unauthorized");

      res = await fetch(`/api${url}`, {
        ...options,
        credentials: "include",
      });
    } finally {
      refreshPromise = null;
    }
  }

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  if (res.status === 204) {
    return null;
  }

  return res.json();
}

export const api = {
  get: (url: string) => request(url, { method: "GET" }),
  post: (url: string, data: JsonBody | object = {}) =>
    request(url, buildOptions("POST", data)),
  patch: (url: string, data: FormData | JsonBody) =>
    request(url, buildOptions("PATCH", data)),
  delete: (url: string) => request(url, { method: "DELETE" }),
};
