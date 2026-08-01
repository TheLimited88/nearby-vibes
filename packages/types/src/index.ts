// User types
export interface User {
  id: string;
  email: string;
  userType: 'customer' | 'venue';
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerUser extends User {
  userType: 'customer';
  displayName: string;
  ageVerified: boolean;
  distanceUnit: 'mi' | 'km';
}

export interface VenueUser extends User {
  userType: 'venue';
  venueName: string;
  venueId: string;
}

// Venue types
export interface Venue {
  id: string;
  name: string;
  googlePlaceId: string;
  address: string;
  latitude: number;
  longitude: number;
  description?: string;
  claimedAt?: Date;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Post types
export interface Post {
  id: string;
  venueId: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  status: 'draft' | 'live' | 'expired';
  isPremium: boolean;
  heroImageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Subscription types
export interface Subscription {
  id: string;
  venueId: string;
  status: 'trial' | 'active' | 'expired' | 'cancelled';
  planType: 'free' | 'premium';
  trialStartsAt?: Date;
  trialEndsAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Trial Follow types
export interface TrialFollow {
  id: string;
  customerId: string;
  venueId: string;
  expiresAt: Date;
  convertedToFollower: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Analytics types
export interface Analytics {
  id: string;
  venueId?: string;
  postId?: string;
  metricType: string;
  value: number;
  period: 'day' | 'week' | 'month';
  collectedAt: Date;
}

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
