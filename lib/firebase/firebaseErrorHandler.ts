import { HttpStatus } from '@/shared/types';
import { FirebaseAppError } from 'firebase-admin/app';
import { FirebaseAuthError } from 'firebase-admin/auth';
import { FirebaseError } from 'firebase/app';

export class FirebaseErrorHandler {
  static handle(
    error: Error | FirebaseAppError | FirebaseAuthError | FirebaseError,
  ) {
    if (
      !(
        error instanceof FirebaseAppError ||
        error instanceof FirebaseAuthError ||
        error instanceof FirebaseError
      )
    ) {
      return null;
    }

    let errorMessage = 'Unknown error occurred';
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    const errorName = error?.name;
    const errorStack = error?.stack;

    if (error.code) {
      switch (error.code) {
        case 'auth/argument-error':
          errorMessage = error.message.split('See https:')[0].trim();
          statusCode = HttpStatus.BAD_REQUEST;
          break;
        case 'auth/email-already-exists':
          errorMessage =
            'The email address is already in use by another account.';
          statusCode = HttpStatus.CONFLICT;
          break;
        case 'auth/invalid-email':
          errorMessage = 'The email address is not valid.';
          statusCode = HttpStatus.BAD_REQUEST;
          break;
        case 'auth/invalid-password':
          errorMessage =
            'The password is invalid. It must be at least 6 characters long.';
          statusCode = HttpStatus.BAD_REQUEST;
          break;
        case 'auth/user-not-found':
          errorMessage =
            'There is no user record corresponding to this identifier. The user may have been deleted.';
          statusCode = HttpStatus.NOT_FOUND;
          break;
        case 'auth/invalid-id-token':
          errorMessage = 'The provided ID token is invalid.';
          statusCode = HttpStatus.UNAUTHORIZED;
          break;
        case 'auth/id-token-expired':
          errorMessage = 'The provided ID token has expired.';
          statusCode = HttpStatus.UNAUTHORIZED;
          break;
        case 'auth/invalid-credential':
          errorMessage =
            'The credentials is invalid, provide correct email and password.';
          statusCode = HttpStatus.UNAUTHORIZED;
          break;
        case 'auth/id-token-revoked':
          errorMessage = 'The user token has been revoked.';
          statusCode = HttpStatus.BAD_REQUEST;
          break;
        case 'auth/insufficient-permission':
          errorMessage =
            'The credential has insufficient permission to access the requested Authentication resource.';
          statusCode = HttpStatus.BAD_REQUEST;
          break;
        case 'auth/too-many-requests':
          errorMessage = 'The number of requests exceeds the maximum allowed.';
          statusCode = HttpStatus.TOO_MANY_REQUESTS;
          break;
        // Add more cases as needed
        default:
          errorMessage = error.message;
          break;
      }
    }

    return { errorMessage, statusCode, errorName, errorStack };
  }
}
