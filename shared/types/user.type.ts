export type TUserType = 'free' | 'premium';
export type TUserRole = 'user' | 'admin';

export interface IUserProfile {
  uid: string;
  stripeCustomerId?: string;
  type?: TUserType;
  displayName?: string;
  email?: string;
  userName?: string;
  lname?: string;
  fname?: string;
  photoUrl?: string;
  image?: Buffer | null | string;
  isVerified?: boolean;
  createdAt?: string | number;
  sunoAccountID?: string;
  lastSunoAccountID?: string;
}