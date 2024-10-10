import { NextResponse } from 'next/server';
import {
  HttpStatus,
  IApiResError,
  IUnsafeObject,
  IApiResponse,
  IValidation,
} from '@/shared/types';
import { FirebaseErrorHandler } from '@/lib/firebase';

type TData = IUnsafeObject | null;

type TResponse<T = unknown> = Partial<IApiResponse<T> & IValidation>;

export class PrepareApiResponse implements IApiResponse {
  metadata = {
    timestamp: new Date().toUTCString(),
  };
  statusCode = HttpStatus.OK;
  error: IApiResError = null;
  data: TData = null;
  message: string = 'Request Success';
  success: boolean = true;

  constructor(response: TResponse, statusCode: HttpStatus = HttpStatus.OK) {
    this.prepareResponse(response, statusCode);
    return this;
  }

  prepareResponse(response: TResponse, statusCode: HttpStatus) {
    this.metadata = { ...this.metadata, ...response.metadata };
    this.data = (
      Object.hasOwn(response, 'data') && response.data === undefined
        ? (response as unknown as IUnsafeObject)
        : (response.data ?? null)
    ) as TData;

    if (response?.message) {
      this.message = response.message;
    }

    if (response?.valid === false) {
      this.statusCode = HttpStatus.BAD_REQUEST;
      this.data = response?.format ?? this.data;
    } else {
      this.statusCode = response?.statusCode || statusCode;
    }

    if (response?.error) {
      this.error = response.error;
    }

    if (response?.error && !response.message) {
      if (this.statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
        this.message = 'Something went wrong. Try again later.';
      } else {
        this.message = 'Request Failed';
      }
    }

    if (this.statusCode >= HttpStatus.BAD_REQUEST) {
      this.success = false;
    }

    if (this.data?.metadata) {
      delete this.data.metadata;
    }
  }

  static response<T = unknown>(
    response: TResponse<T>,
    statusCode: HttpStatus = HttpStatus.OK,
  ) {
    const result = new PrepareApiResponse(response, statusCode);
    return NextResponse.json(result, {
      status: result.statusCode,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  static errorsResponse(error: any) {
    let response = {} as TResponse;
    let errorStack = null;
    const fbError = FirebaseErrorHandler.handle(error);

    if (fbError) {
      response = {
        error: {
          name: fbError.errorName,
          message: fbError.errorMessage,
        },
        message:
          typeof fbError?.errorMessage === 'string'
            ? fbError?.errorMessage
            : error?.message,
        statusCode: fbError.statusCode,
      };
      errorStack = fbError?.errorStack;
    } else {
      const { message, name, stack, code } =
        error as unknown as IUnsafeObject<string>;
      errorStack = stack;
      const statusCode = Number(code ?? error?.statusCode) as number;
      response = {
        error: {
          message: error?.error?.message ?? message,
          name: error?.error?.name ?? name,
          code: error?.error?.code ?? code,
        },
        message: typeof message === 'string' ? message : String(message),
        statusCode:
          statusCode > HttpStatus.BAD_REQUEST
            ? statusCode
            : HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const result = new PrepareApiResponse(response);
    console.error('Response error: ', { ...response, errorStack });
    return NextResponse.json(result, {
      status: result.statusCode,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
