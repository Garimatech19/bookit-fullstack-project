import axios from 'axios';
import type {
  Experience,
  ExperienceWithSlots,
  PromoCode,
  Booking,
  CreateBookingData
} from '../types/types';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetches all experiences
 * Corresponds to: GET /experiences
 */
export const getExperiences = (searchQuery?: string | null) => {
  return apiClient.get<Experience[]>('/experiences', {
    params: {
      search: searchQuery || undefined,
    },
  });
};

export const getExperienceById = (id: string) => {
  return apiClient.get<ExperienceWithSlots>(`/experiences/${id}`);
};

export const validatePromo = (code: string) => {
  return apiClient.post<PromoCode>('/promo/validate', { code });
};

export const createBooking = (data: CreateBookingData) => {
  // The backend returns { success: true, booking: ... }
  return apiClient.post<{ success: boolean; booking: Booking }>('/bookings', data);
};