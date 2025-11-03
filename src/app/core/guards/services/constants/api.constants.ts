export const API_CONSTANTS = {
  BASE_URL: 'http://localhost:3000',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH_TOKEN: '/auth/refresh-token'
    },
    TODOS: {
      BASE: '/todos',
      BY_ID: (id: number) => `/todos/${id}`,
      COMPLETE: (id: number) => `/todos/${id}/complete`
    }
  },
  HEADERS: {
    AUTH: 'Authorization',
    CONTENT_TYPE: 'Content-Type',
    ACCEPT: 'Accept'
  }
};