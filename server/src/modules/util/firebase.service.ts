import { Injectable } from '@nestjs/common';
import { App, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

@Injectable()
export class FirebaseService {
  private app: App;

  constructor() {
    this.app = initializeApp();
  }

  getAuth() {
    return getAuth(this.app);
  }
}
