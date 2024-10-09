export type TUserType = 'free' | 'premium';
export type TUserRole = 'user' | 'admin';

export interface IUserProfile {
  uid: string;
  stripeCustomerId?: string;
  type?: TUserType;
  displayName?: string;
  email?: string;
  userName?: string;
  photoUrl?: string;
  isVerified?: boolean;
  createdAt?: string | number;
  sunoAccountID?: string;
  lastSunoAccountID?: string;
}