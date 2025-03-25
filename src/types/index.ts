export interface Hotel {
  id: string;
  name: string;
  description: string;
  location: string;
  image_url: string;
  price_per_night: number;
  rating: number;
  amenities: string[];
  created_at: string;
}

export interface Room {
  id: string;
  hotel_id: string;
  room_number: string;
  type: string;
  price: number;
  is_available: boolean;
}

export interface Booking {
  id: string;
  user_id: string;
  hotel_id: string;
  room_id: string;
  check_in: string;
  check_out: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}

export interface SearchFilters {
  location: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  rooms: number;
}