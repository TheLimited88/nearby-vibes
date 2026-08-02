import { Injectable, Logger } from '@nestjs/common';
import * as speakeasy from 'speakeasy';

@Injectable()
export class TotpService {
  private readonly logger = new Logger(TotpService.name);

  // Generate a new TOTP secret (for setting up MFA)
  generateSecret(email: string) {
    const secret = speakeasy.generateSecret({
      name: `Nearby Vibes Admin (${email})`,
      issuer: 'Nearby Vibes',
      length: 32,
    });

    return {
      secret: secret.base32,
      qrCode: secret.otpauth_url,
    };
  }

  // Generate QR code URL from existing secret
  generateQrCodeUrl(email: string, secret: string): string {
    return `otpauth://totp/Nearby%20Vibes%20Admin%20(${encodeURIComponent(email)})?secret=${secret}&issuer=Nearby%20Vibes`;
  }

  // Verify a TOTP token
  verifyToken(secret: string, token: string): boolean {
    try {
      const isValid = speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: token,
        window: 2, // Allow 2 time windows (±30 seconds)
      });

      return isValid;
    } catch (error) {
      this.logger.error('TOTP verification failed', error);
      return false;
    }
  }
}
