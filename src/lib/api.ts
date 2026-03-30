import { getToken } from './auth';

const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/+$/, '') ?? 'http://localhost:8080';

async function parseJsonSafely<T>(res: Response): Promise<T | undefined> {
  const raw = await res.text();
  if (!raw.trim()) {
    return undefined;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await parseJsonSafely<{ message?: string; error?: string } & T>(res);

  if (!res.ok) {
    let message = res.statusText;
    if (typeof data?.message === 'string') message = data.message;
    else if (typeof data?.error === 'string') message = data.error;
    throw new Error(message || `Request failed with status ${res.status}`);
  }

  if (res.status === 204 || data === undefined) {
    // @ts-expect-error - caller should handle void
    return undefined;
  }

  return data as T;
}

export async function apiGet<T>(path: string): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return handleResponse<T>(res);
}

export async function apiPost<TRequest, TResponse>(
  path: string,
  body: TRequest,
): Promise<TResponse> {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  return handleResponse<TResponse>(res);
}

export async function apiDelete(path: string): Promise<void> {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    // Only parse/throw on error; many DELETE endpoints return 200/204 with no body
    await handleResponse<void>(res);
  }
}
