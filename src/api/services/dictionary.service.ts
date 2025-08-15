import { apiCall } from "../index";
import { ENDPOINT } from "../endpoint";
import type { DictionaryEntry } from "../../models";
import type { ApiResponse } from "../../models";

export interface DictionaryFilters {
  page?: number;
  per_page?: number;
  search?: string;
  part_of_speech?: string;
  difficulty_level?: number;
  verified?: boolean;
}

export interface CreateDictionaryEntry {
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
}

export const dictionaryService = {
  getEntries: async (
    filters: DictionaryFilters = {},
    token: string
  ): Promise<ApiResponse<DictionaryEntry[]>> => {
    const queryParams = new URLSearchParams(
      Object.entries(filters)
        .filter(([, value]) => value !== undefined && value !== "")
        .map(([key, value]) => [key, String(value)])
    );

    const endpoint = queryParams.toString()
      ? `${ENDPOINT.DICTIONARY}?${queryParams}`
      : ENDPOINT.DICTIONARY;

    return apiCall<ApiResponse<DictionaryEntry[]>>(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getEntry: async (
    id: string,
    token: string
  ): Promise<ApiResponse<DictionaryEntry>> => {
    return apiCall<ApiResponse<DictionaryEntry>>(
      `${ENDPOINT.DICTIONARY}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  createEntry: async (
    entry: CreateDictionaryEntry,
    token: string
  ): Promise<ApiResponse<DictionaryEntry>> => {
    return apiCall<ApiResponse<DictionaryEntry>>(ENDPOINT.DICTIONARY, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: entry,
    });
  },

  updateEntry: async (
    id: string,
    entry: Partial<CreateDictionaryEntry>,
    token: string
  ): Promise<ApiResponse<DictionaryEntry>> => {
    return apiCall<ApiResponse<DictionaryEntry>>(
      `${ENDPOINT.DICTIONARY}/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: entry,
      }
    );
  },

  deleteEntry: async (
    id: string,
    token: string
  ): Promise<ApiResponse<null>> => {
    return apiCall<ApiResponse<null>>(`${ENDPOINT.DICTIONARY}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
