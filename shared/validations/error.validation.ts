import { z } from 'zod';
import { HttpStatus, IApiError, IApiResError } from '../types';

export class ValidationError extends Error {
  code: number = HttpStatus.BAD_REQUEST;
  valid: boolean = false;
  format: unknown = {};
  error: IApiResError = [];

  constructor(error: z.ZodError | Error, message?: string) {
    super(message ?? error?.message);
    this.name = 'ValidationError';
    this.message = `${this.name}: ${this.message}`;
    this.handle(error, message);
    return this;
  }

  /**
   * Handle Method
   * @param error 
   * @param message 
   */
  handle(error: z.ZodError | Error, message?: string) {
    if (error instanceof z.ZodError) {
      const errors = error as z.ZodError;
      this.valid = false;
      this.format = errors.flatten().fieldErrors;
      this.error = errors.errors as unknown as IApiResError;

    } else if (error instanceof Error) {
      this.error = {
        message: error.message ?? message,
        name: this.name ?? error?.name,
        cause: error?.cause,
      } as IApiResError;
    }
  }
}

export class CustomError extends Error {
  code: number = HttpStatus.BAD_REQUEST;
  error: IApiError = {} as IApiError;

  constructor(message: string, error: IApiError) {
    super(message ?? error?.message);
    this.error = error;

    if (error?.statusCode) {
      this.code = error?.statusCode as number;
    }
    
    return this;
  }
}
