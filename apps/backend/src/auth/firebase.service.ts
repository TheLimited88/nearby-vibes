import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);
  private firebaseApp: admin.app.App;

  constructor() {
    try {
      const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      };

      if (
        !serviceAccount.projectId ||
        !serviceAccount.privateKey ||
        !serviceAccount.clientEmail
      ) {
        throw new Error('Missing Firebase credentials in environment variables');
      }

      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as any),
      });

      this.logger.log('Firebase Admin SDK initialized');
    } catch (error) {
      this.logger.error('Failed to initialize Firebase Admin SDK', error);
      throw error;
    }
  }

  async verifyIdToken(token: string) {
    try {
      return await admin.auth(this.firebaseApp).verifyIdToken(token);
    } catch (error) {
      throw new Error(`Invalid ID token: ${error.message}`);
    }
  }

  async createUser(email: string, password: string) {
    try {
      return await admin.auth(this.firebaseApp).createUser({
        email,
        password,
        emailVerified: false,
      });
    } catch (error) {
      throw new Error(`Failed to create Firebase user: ${error.message}`);
    }
  }

  async deleteUser(firebaseUid: string) {
    try {
      await admin.auth(this.firebaseApp).deleteUser(firebaseUid);
    } catch (error) {
      throw new Error(`Failed to delete Firebase user: ${error.message}`);
    }
  }
}
