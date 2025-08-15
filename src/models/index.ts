import { ROLES } from "../constants";

export interface IAuthInfo {
  user: {
    id: string;
    email: string;
    role: ROLES;
    name?: string;
    avatar?: string;
  };
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface DictionaryEntry {
  id: string;
  pnar_word: string;
  english_word: string;
  part_of_speech?: string;
  definition?: string;
  example_pnar?: string;
  example_english?: string;
  difficulty_level?: number;
  usage_frequency?: number;
  cultural_context?: string;
  related_words?: string;
  pronunciation?: string;
  etymology?: string;
  verified?: boolean;
  created_at?: string;
  updated_at?: string;
}

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

export interface User {
  id: string;
  email: string;
  name: string;
  role: ROLES;
  avatar?: string;
  isActive: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginationParams {
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

// Form state types
export interface FormState {
  isSubmitting: boolean;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

// API Error types
export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}
