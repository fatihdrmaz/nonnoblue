export type UserRole = 'customer' | 'admin' | 'manager' | 'captain' | 'ops' | 'finance';
export type BookingStatus =
  | 'pending'
  | 'awaiting_3ds'
  | 'confirmed'
  | 'balance_paid'
  | 'completed'
  | 'cancelled'
  | 'refunded';
export type ServiceType = 'bareboat' | 'skippered' | 'crewed';
export type Currency = 'EUR' | 'TRY';
export type BoatType = 'catamaran' | 'monohull' | 'gulet';
export type AvailabilityStatus = 'option' | 'blocked' | 'maintenance' | 'crew';

export interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  country: string | null;
  preferred_language: string;
  preferred_currency: Currency;
  marketing_consent: boolean;
  kvkk_consent_at: string | null;
  role: UserRole;
  created_at: string;
}

export interface Boat {
  id: string;
  slug: string;
  name: string;
  type: BoatType;
  brand: string | null;
  model: string | null;
  year: number | null;
  length_m: number | null;
  beam_m: number | null;
  cabins: number | null;
  bathrooms: number | null;
  max_guests: number | null;
  marina: string | null;
  deposit_eur: number | null;
  description_tr: string | null;
  description_en: string | null;
  features: string[];
  galley: string[];
  electrics: string[];
  deck: string[];
  active: boolean;
  display_order: number;
  created_at: string;
}

export interface BoatPhoto {
  id: string;
  boat_id: string;
  storage_path: string;
  variants: { thumb?: string; card?: string; full?: string } | null;
  position: number;
  alt_text: string | null;
}

export interface BoatPricing {
  id: string;
  boat_id: string;
  start_date: string;
  end_date: string;
  weekly_price_eur: number;
}

export interface Booking {
  id: string;
  code: string;
  user_id: string | null;
  boat_id: string | null;
  start_date: string;
  end_date: string;
  guest_count: number | null;
  service_type: ServiceType | null;
  currency: Currency;
  fx_rate: number | null;
  total_amount: number;
  deposit_amount: number;
  balance_amount: number;
  status: BookingStatus;
  iyzico_token: string | null;
  iyzico_payment_id: string | null;
  iyzico_conversation_id: string | null;
  iyzico_response: Record<string, unknown> | null;
  balance_payment_id: string | null;
  balance_paid_at: string | null;
  contract_accepted_at: string | null;
  ip_address: string | null;
  user_agent: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface BookingExtra {
  id: string;
  booking_id: string;
  name: string;
  price_amount: number;
  qty: number;
}
