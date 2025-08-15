const API_URL = import.meta.env.VITE_API_URL;

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface FetchOptions {
  method?: Method;
  headers?: Record<string, string>;
  body?: object;
  signal?: AbortSignal;
}

export default async function appFetch<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const { method = 'GET', headers = {}, body, signal } = options;
  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }
  const fetchOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      ...headers,
    },
    signal,
  };
  if (method !== 'GET' && body !== undefined) {
    fetchOptions.body = JSON.stringify(body);
  }
  const response = await fetch(url, fetchOptions);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
}

export const consumeApi = async (
  endpoint: string, //(typeof ENDPOINT)[keyof typeof ENDPOINT],
  method?: Method,
  body?: object
) => await appFetch<Promise<T>>(API_URL + endpoint, { method, body });
