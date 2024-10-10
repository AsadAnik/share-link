import firebaseAdmin from 'firebase-admin';
import { ECollections, ICollections, IUnsafeObject } from '@/shared/types';

export class FirebaseAdmin {
  static instance = null as unknown as FirebaseAdmin;
  private FbAdmin = null as unknown as firebaseAdmin.app.App;
  private auth = null as unknown as firebaseAdmin.auth.Auth;
  private db = null as unknown as firebaseAdmin.firestore.Firestore;
  private storage = null as unknown as firebaseAdmin.storage.Storage;

  collections: ICollections = {
    [ECollections.PROFILE]: ECollections.PROFILE,
    [ECollections.LINK]: ECollections.LINK,
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
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET
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
    this.storage = this.FbAdmin.storage();
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


  getStorage(): firebaseAdmin.storage.Storage {
    if (!this.storage) {
      this.initFirebase();
    }
    return this.storage;
  }

  async storeFile({
    folderName,
    fileName,
    file,
    type,
  }: {
    folderName: string;
    fileName: string;
    file: Buffer;
    type: string;
  }) {
    try {
      const bucket = this.storage.bucket();
      const fileUpload = bucket.file(`${folderName}/${fileName}`);

      await fileUpload.save(file, {
        contentType: type,
      });

      await fileUpload.makePublic();
      const uploadUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
      return uploadUrl;

    } catch (error) {
      const { message } = error as unknown as IUnsafeObject;
      console.error('File storage error:', message);
      throw error;
    }
  }
}
