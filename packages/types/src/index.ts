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

export interface AdminUser {
  id: string;
  email: string;
  totp_enabled: boolean;
  created_at: Date;
}

export interface AuditLog {
  id: string;
  admin_id: string;
  action: string;
  details: Record<string, any>;
  ip_address: string;
  created_at: Date;
}
