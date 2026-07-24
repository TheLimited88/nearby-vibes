// Shared types for Nearby Vibes

export interface User {
  id: string;
  email: string;
  displayName: string;
  createdAt: Date;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  createdAt: Date;
}

export interface Post {
  id: string;
  venueId: string;
  title: string;
  description: string;
  expiresAt: Date;
  createdAt: Date;
}
