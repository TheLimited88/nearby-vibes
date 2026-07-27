import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private firebaseApp: admin.app.App;

  constructor() {
    // Initialize Firebase Admin SDK with service account
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };

    this.firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as any),
    });
  }

  getAuth() {
    return admin.auth(this.firebaseApp);
  }

  getMessaging() {
    return admin.messaging(this.firebaseApp);
  }

  async verifyIdToken(token: string) {
    try {
      return await this.getAuth().verifyIdToken(token);
    } catch (error) {
      throw new Error(`Invalid ID token: ${error.message}`);
    }
  }

  async createUser(email: string, password: string) {
    try {
      return await this.getAuth().createUser({
        email,
        password,
      });
    } catch (error) {
      throw new Error(`Failed to create Firebase user: ${error.message}`);
    }
  }

  async deleteUser(firebaseUid: string) {
    try {
      await this.getAuth().deleteUser(firebaseUid);
    } catch (error) {
      throw new Error(`Failed to delete Firebase user: ${error.message}`);
    }
  }

  async sendPasswordResetEmail(email: string) {
    try {
      return await this.getAuth().generatePasswordResetLink(email);
    } catch (error) {
      throw new Error(`Failed to generate reset link: ${error.message}`);
    }
  }
}
