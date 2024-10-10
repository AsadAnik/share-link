import { z } from 'zod';
import { SingUpSchema, SingInSchema } from '@/shared/validations';
import { IUnsafeObject } from './type';

export enum EAuthAction {
  SIGNIN = 'signin',
  SIGNUP = 'singup',
}

export type TSingUp = z.infer<typeof SingUpSchema>;
export type TSingIn = z.infer<typeof SingInSchema>;

export interface IAuthUser {
  uid: string;
  displayName: string;
  lname?: string;
  fname?: string;
  email: string;
  photoUrl?: string;
  emailVerified: boolean;
  disabled?: boolean;
  accessToken: string;
  customToken?: string;
  tokenExpireAt?: number;
}

export interface IAuthSliceState {
  user: null | IAuthUser;
  isLoading: boolean;
  result: null | IUnsafeObject;
}
