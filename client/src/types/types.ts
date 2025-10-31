export interface Experience {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  imageUrl: string;
}
export interface Slot {
  id: string;
  experienceId: string;
  startTime: string; 
  endTime: string;   
  isAvailable: boolean;
}

// This is the type returned by the GET /experiences/:id endpoint
export type ExperienceWithSlots = Experience & {
  slots: Slot[];
}

// This is the data we send when creating a booking
export interface CreateBookingData {
  slotId: string;
  customerName: string;
  customerEmail: string;
  promoCode?: string;
  finalPrice: number;
}

// This is the data returned by the POST /bookings endpoint
export interface Booking {
  id: string;
  slotId: string;
  customerName: string;
  customerEmail: string;
  promoCode?: string | null;
  finalPrice: number;
  createdAt: string; // ISO string
}

// This is the data returned by the POST /promo/validate endpoint
export interface PromoCode {
  id: string;
  code: string;
  discount: number;
  isPercent: boolean;
  isActive: boolean;
}