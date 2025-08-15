import { API_URL } from "../app.config";

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  pagination?: {
    page: number;
    per_page: number;
    total: number;
    pages: number;
  };
}

export interface FetchOptions {
  method?: Method;
  headers?: Record<string, string>;
  body?: object;
  signal?: AbortSignal;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: Response
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export default async function appFetch<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const { method = "GET", headers = {}, body, signal } = options;

  if (signal?.aborted) {
    throw new DOMException("Aborted", "AbortError");
  }

  const fetchOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    signal,
  };

  if (method !== "GET" && body !== undefined) {
    fetchOptions.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      throw new ApiError(
        `HTTP error! Status: ${response.status}`,
        response.status,
        response
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError("Network error occurred", 0);
  }
}

// Utility function for API calls with automatic URL construction
export const apiCall = async <T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> => {
  const url = `${API_URL}${endpoint}`;
  return appFetch<T>(url, options);
};
