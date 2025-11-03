export const STORAGE_CONSTANTS = {
  PREFIX: 'app_',
  KEYS: {
    AUTH_TOKEN: 'app_auth_token',
    USER_DATA: 'app_user_data',
    LANGUAGE: 'app_language',
    THEME: 'app_theme',
    SETTINGS: 'app_settings'
  },
  TTL: {
    AUTH_TOKEN: 24 * 60 * 60 * 1000, // 24 hours
    CACHE: 5 * 60 * 1000 // 5 minutes
  }
};