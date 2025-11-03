export enum StorageKeys {
    // Authentication related
    AUTH_TOKEN = 'auth_token',
    REFRESH_TOKEN = 'refresh_token',
    USER_DATA = 'user_data',
    REMEMBER_ME = 'remember_me',
    LOGIN_TIMESTAMP = 'login_timestamp',

    // App preferences
    LANGUAGE = 'app_language',
    THEME = 'app_theme',
    FONT_SIZE = 'app_font_size',
    NOTIFICATIONS_ENABLED = 'notifications_enabled',

    // Session related
    LAST_ACTIVE = 'last_active',
    SESSION_ID = 'session_id',

    // App state
    LAST_ROUTE = 'last_route',
    SIDEBAR_STATE = 'sidebar_state',
    SEARCH_HISTORY = 'search_history'
}