import { HttpStatus, IUnsafeObject } from '@/shared/types';
import { headers } from 'next/headers';
import { verifyAuthToken } from '@/app/api/auth/auth.service';


export class AuthenticationError extends Error {
  statusCode: number;
  error: any;

  constructor(
    message: string,
    statusCode = HttpStatus.FORBIDDEN,
    error: any = {},
  ) {
    super(message);
    this.statusCode = statusCode;
    this.error = error;
  }
}

/**
 * IsAuthenticated Middleware Method
 * @param token 
 * @param soft 
 * @returns 
 */
export const IsAuthenticated = async (token?: string, soft = false) => {
  if (!token) {
    token = (headers().get('authorization') ?? headers().get('Authorization')) as string;
    token = token?.split('bearer ')[1] || token?.split('Bearer ')[1];
  }

  if (!soft && !token) {
    throw new AuthenticationError('Access Denied. Authorization token is required.');
  }

  try {
    return await verifyAuthToken(token);

  } catch (error) {
    if (!soft) {
      throw new AuthenticationError('Access Denied. Authorization token is mismatch.', HttpStatus.UNAUTHORIZED, error);
    }

    return {} as IUnsafeObject<any>;
  }
};
