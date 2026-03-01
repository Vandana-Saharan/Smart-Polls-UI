const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/+$/, '') ?? 'https://smart-polls-backend-4.onrender.com';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = res.statusText;
    try {
      const data = (await res.json()) as { message?: string; error?: string };
      if (typeof data?.message === 'string') message = data.message;
      else if (typeof data?.error === 'string') message = data.error;
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(message || `Request failed with status ${res.status}`);
  }
  // 204 No Content
  if (res.status === 204) {
    // @ts-expect-error - caller should handle void
    return undefined;
  }
  return (await res.json()) as T;
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });
  return handleResponse<T>(res);
}

export async function apiPost<TRequest, TResponse>(
  path: string,
  body: TRequest,
): Promise<TResponse> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });
  return handleResponse<TResponse>(res);
}

export async function apiDelete(path: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
    },
  });
  if (!res.ok) {
    // Only parse/throw on error; many DELETE endpoints return 200/204 with no body
    await handleResponse<void>(res);
  }
}
