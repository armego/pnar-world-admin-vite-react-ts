// Storage keys for localStorage/sessionStorage
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  EXPIRES_IN: "expiresIn",
  USER_PREFERENCES: "userPreferences",
} as const;

// User roles
export enum ROLES {
  ADMIN = "admin",
  USER = "user",
  GUEST = "guest",
}

// API configuration
export const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PER_PAGE: 10,
  MAX_PER_PAGE: 100,
} as const;

// Dictionary difficulty levels
export const DIFFICULTY_LEVELS = {
  BEGINNER: 1,
  INTERMEDIATE: 2,
  ADVANCED: 3,
  EXPERT: 4,
} as const;

// Parts of speech
export const PARTS_OF_SPEECH = [
  "noun",
  "verb",
  "adjective",
  "adverb",
  "pronoun",
  "preposition",
  "conjunction",
  "interjection",
] as const;

// App navigation
export const NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard", icon: "home" },
  { path: "/translation", label: "Dictionary", icon: "book" },
  { path: "/users", label: "Users", icon: "users" },
  { path: "/profile", label: "Profile", icon: "user" },
] as const;

// Theme configuration
export const THEME = {
  COLORS: {
    PRIMARY: "#00d1b2",
    SECONDARY: "#3273dc",
    SUCCESS: "#23d160",
    WARNING: "#ffdd57",
    DANGER: "#ff3860",
  },
  BREAKPOINTS: {
    MOBILE: "768px",
    TABLET: "1024px",
    DESKTOP: "1216px",
  },
} as const;
