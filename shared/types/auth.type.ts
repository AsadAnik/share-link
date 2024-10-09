import { IUnsafeObject } from './type';

export enum EAuthAction {
  SIGNIN = 'signin',
  SIGNUP = 'singup',
}

export interface IAuthUser {
  uid: string;
  displayName: string;
  email: string;
  photoUrl: string;
  emailVerified: boolean;
  disabled?: boolean;
  accessToken: string;
  tokenExpireAt?: number;
}

export interface IAuthSliceState {
  user: null | IAuthUser;
  isLoading: boolean;
  result: null | IUnsafeObject;
}
