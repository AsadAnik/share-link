import firebaseAdmin from 'firebase-admin';
import { ECollections, ICollections } from '@/shared/types';

export class FirebaseAdmin {
  static instance = null as unknown as FirebaseAdmin;
  private FbAdmin = null as unknown as firebaseAdmin.app.App;
  private auth = null as unknown as firebaseAdmin.auth.Auth;
  private db = null as unknown as firebaseAdmin.firestore.Firestore;
  collections: ICollections = {
    [ECollections.PROFILE]: ECollections.PROFILE,
  } as ICollections;

  static init() {
    if (this.instance && this.instance?.FbAdmin) {
      return this.instance;
    } else {
      this.instance = new FirebaseAdmin();
      this.instance.initFirebase();
    }
    return this.instance;
  }

  private initFirebase() {
    if (!this.FbAdmin) {
      if (!firebaseAdmin.apps.length) {
        this.FbAdmin = firebaseAdmin.initializeApp({
          credential: firebaseAdmin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          }),
        });
        this.FbAdmin.firestore().settings({
          ignoreUndefinedProperties: true,
        });
      } else {
        this.FbAdmin = firebaseAdmin as unknown as firebaseAdmin.app.App;
      }
    }
    this.auth = this.FbAdmin.auth();
    this.db = this.FbAdmin.firestore();
  }

  getAuth() {
    if (!this.auth) {
      this.initFirebase();
    }
    return this.auth;
  }

  getFireStore() {
    if (!this.db) {
      this.initFirebase();
    }
    return this.db;
  }
}
