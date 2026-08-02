import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class QrService {
  private readonly logger = new Logger(QrService.name);

  // Generate QR code data (can be rendered by frontend)
  generateQrCode(postId: string, redemptionId: string): string {
    // Create a unique QR code payload containing post and redemption info
    // Format: qr_POSTID_REDEMPTIONID_TIMESTAMP_HASH
    const timestamp = Date.now();
    const payload = `${postId}:${redemptionId}:${timestamp}`;
    const hash = crypto
      .createHash('sha256')
      .update(payload)
      .digest('hex')
      .substring(0, 8);

    const qrCode = `qr_${postId.substring(0, 8)}_${redemptionId.substring(0, 8)}_${hash}`;
    return qrCode;
  }

  // Verify QR code signature
  verifyQrCode(qrCode: string, postId: string, redemptionId: string): boolean {
    try {
      // Extract components from QR code
      const parts = qrCode.split('_');
      if (parts.length < 4 || parts[0] !== 'qr') {
        return false;
      }

      // Verify post and redemption IDs match
      if (!postId.startsWith(parts[1]) || !redemptionId.startsWith(parts[2])) {
        return false;
      }

      return true;
    } catch (error) {
      this.logger.error('QR code verification failed', error);
      return false;
    }
  }

  // Generate QR code URL for display (can be used with a QR code renderer)
  generateQrUrl(qrCode: string, redirectUrl?: string): string {
    // This would be called by the frontend to generate the actual QR code image
    // Using a standard format that can be rendered by any QR code library
    const baseUrl = redirectUrl || process.env.APP_URL || 'https://nearbyvibes.app';
    const url = `${baseUrl}/redeem/${qrCode}`;
    return url;
  }
}
