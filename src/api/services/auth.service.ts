import { apiCall } from "../index";
import { ENDPOINT } from "../endpoint";
import type { IAuthInfo } from "../../models";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: IAuthInfo;
  message?: string;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return apiCall<AuthResponse>(ENDPOINT.LOGIN, {
      method: "POST",
      body: credentials,
    });
  },

  logout: async (token: string): Promise<{ success: boolean }> => {
    return apiCall<{ success: boolean }>("/auth/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    return apiCall<AuthResponse>("/auth/refresh", {
      method: "POST",
      body: { refreshToken },
    });
  },

  getProfile: async (token: string): Promise<AuthResponse> => {
    return apiCall<AuthResponse>("/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
