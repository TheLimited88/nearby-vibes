import axios, { AxiosInstance } from 'axios';
import { useAuthStore } from '@/stores/authStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

let apiClient: AxiosInstance | null = null;

export const getApiClient = (): AxiosInstance => {
  if (apiClient) return apiClient;

  apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  apiClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  apiClient.interceptors.response.use(
    (response) => response,
    (error: any) => {
      if (error.response?.status === 401) {
        useAuthStore.getState().logout();
      }
      return Promise.reject(error);
    }
  );

  return apiClient;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const authAPI = {
  signUp: (email: string, password: string, role: 'customer' | 'venue') =>
    getApiClient().post('/auth/signup', { email, password, role }),

  loginEmail: (email: string, password: string, role: 'customer' | 'venue') =>
    getApiClient().post(`/auth/${role}/login/email`, { email, password }),

  verifyToken: (token: string) =>
    getApiClient().post('/auth/verify', { token }),
};

export const discoveryAPI = {
  searchVenues: (query: string, latitude?: number, longitude?: number) =>
    getApiClient().get('/discovery/search', { params: { q: query, latitude, longitude } }),

  getNearbyVenues: (latitude: number, longitude: number, radiusKm?: number) =>
    getApiClient().get('/discovery/nearby', { params: { latitude, longitude, radiusKm } }),

  getPopularVenues: () =>
    getApiClient().get('/discovery/popular'),

  getPersonalizedFeed: () =>
    getApiClient().get('/discovery/feed'),
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const postsAPI = {
  createPost: (data: any) =>
    getApiClient().post('/posts', data),

  updatePost: (postId: string, data: any) =>
    getApiClient().put(`/posts/${postId}`, data),

  publishPost: (postId: string) =>
    getApiClient().post(`/posts/${postId}/publish`, {}),

  cancelPost: (postId: string) =>
    getApiClient().post(`/posts/${postId}/cancel`, {}),

  getPost: (postId: string) =>
    getApiClient().get(`/posts/${postId}`),

  getPostMetrics: (postId: string) =>
    getApiClient().get(`/posts/${postId}/metrics`),
};

export const socialAPI = {
  likePost: (postId: string) =>
    getApiClient().post(`/social/posts/${postId}/like`, {}),

  unlikePost: (postId: string) =>
    getApiClient().delete(`/social/posts/${postId}/like`),

  commentPost: (postId: string, text: string) =>
    getApiClient().post(`/social/posts/${postId}/comments`, { text }),

  getPostStats: (postId: string) =>
    getApiClient().get(`/social/posts/${postId}/stats`),
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const notificationsAPI = {
  getPreferences: () =>
    getApiClient().get('/notifications/preferences'),

  updatePreferences: (prefs: any) =>
    getApiClient().put('/notifications/preferences', prefs),

  registerToken: (token: string, platform?: string) =>
    getApiClient().post('/notifications/tokens', { token, platform }),

  getTokens: () =>
    getApiClient().get('/notifications/tokens'),

  unregisterToken: (tokenId: string) =>
    getApiClient().delete(`/notifications/tokens/${tokenId}`),
};

export const subscriptionsAPI = {
  getCurrentSubscription: () =>
    getApiClient().get('/subscriptions/current'),

  createCheckout: (data: { plan: 'premium' | 'pro'; promoCode?: string }) =>
    getApiClient().post('/subscriptions/checkout', data),

  checkPremiumAccess: () =>
    getApiClient().get('/subscriptions/premium-access'),

  getEvents: (subscriptionId: string) =>
    getApiClient().get(`/subscriptions/events/${subscriptionId}`),
};
