import { useState, useEffect } from "react";
import { STORAGE_KEYS } from "../constants";

type StorageType = "localStorage" | "sessionStorage";

export function useStorage<T>(
  key: string,
  defaultValue: T,
  storageType: StorageType = "localStorage"
) {
  const [value, setValue] = useState<T>(() => {
    try {
      const storage =
        storageType === "localStorage" ? localStorage : sessionStorage;
      const item = storage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading ${storageType} key "${key}":`, error);
      return defaultValue;
    }
  });

  const setStorageValue = (newValue: T) => {
    try {
      setValue(newValue);
      const storage =
        storageType === "localStorage" ? localStorage : sessionStorage;
      if (newValue === null || newValue === undefined) {
        storage.removeItem(key);
      } else {
        storage.setItem(key, JSON.stringify(newValue));
      }
    } catch (error) {
      console.warn(`Error setting ${storageType} key "${key}":`, error);
    }
  };

  return [value, setStorageValue] as const;
}

// Specific hooks for commonly used storage items
export function useAccessToken() {
  return useStorage<string | null>(
    STORAGE_KEYS.ACCESS_TOKEN,
    null,
    "sessionStorage"
  );
}

export function useRefreshToken() {
  return useStorage<string | null>(
    STORAGE_KEYS.REFRESH_TOKEN,
    null,
    "sessionStorage"
  );
}

export function useUserPreferences() {
  return useStorage(STORAGE_KEYS.USER_PREFERENCES, {
    theme: "light",
    language: "en",
    pageSize: 10,
  });
}
