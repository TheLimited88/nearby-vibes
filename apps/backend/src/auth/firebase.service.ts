import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);

  constructor() {
    // Firebase integration will be added in Phase 2
    this.logger.log('FirebaseService initialized (Phase 2 integration pending)');
  }

  async verifyIdToken(token: string) {
    throw new Error('Firebase integration not yet implemented');
  }

  async createUser(email: string, password: string) {
    throw new Error('Firebase integration not yet implemented');
  }

  async deleteUser(firebaseUid: string) {
    throw new Error('Firebase integration not yet implemented');
  }
}
