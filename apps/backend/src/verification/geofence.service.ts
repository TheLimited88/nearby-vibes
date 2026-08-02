import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GeofenceService {
  private readonly logger = new Logger(GeofenceService.name);

  // Distance in meters for geofence (default 100m)
  private readonly GEOFENCE_RADIUS_M = 100;

  // Calculate distance between two coordinates using Haversine formula
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371000; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance);
  }

  // Verify if user is within geofence of venue
  isWithinGeofence(
    userLat: number,
    userLon: number,
    venueLat: number,
    venueLon: number,
    radiusM?: number,
  ): boolean {
    const radius = radiusM || this.GEOFENCE_RADIUS_M;
    const distance = this.calculateDistance(
      userLat,
      userLon,
      venueLat,
      venueLon,
    );

    return distance <= radius;
  }

  // Get distance from user to venue
  getDistance(
    userLat: number,
    userLon: number,
    venueLat: number,
    venueLon: number,
  ): number {
    return this.calculateDistance(userLat, userLon, venueLat, venueLon);
  }

  // Validate user coordinates
  validateCoordinates(
    latitude: number,
    longitude: number,
  ): { valid: boolean; error?: string } {
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return { valid: false, error: 'Coordinates must be numbers' };
    }

    if (latitude < -90 || latitude > 90) {
      return { valid: false, error: 'Latitude must be between -90 and 90' };
    }

    if (longitude < -180 || longitude > 180) {
      return { valid: false, error: 'Longitude must be between -180 and 180' };
    }

    return { valid: true };
  }
}
