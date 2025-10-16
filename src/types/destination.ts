export interface Destination {
  id: string;
  name: string;
  category: 'island' | 'city' | 'mountain' | 'nature' | 'culture';
  shortDescription: string;
  description: string;
  imageUrl: string;
  bestSeason?: string;
  basePrice?: number;
  tags?: string[];
}

export interface BookingPayload {
  destinationId: string;
  name: string;
  email: string;
  phone?: string;
  date: string; // ISO date
  people: number;
  note?: string;
}
