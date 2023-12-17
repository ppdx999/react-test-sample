export const errorCodes = {
  InvalidCredentials: "InvalidCredentials",
} as const;

export type ErrorCode = typeof errorCodes[keyof typeof errorCodes];


export class BaseError extends Error {
  constructor(public code: ErrorCode, message: string) {
    super(message);
  }
}

export class InvalidCredentialsError extends BaseError {
  constructor() {
    super(errorCodes.InvalidCredentials, "メールアドレスまたはパスワードが間違っています");
  }
}

export const isInvalidCredentialsError = (error: unknown): error is InvalidCredentialsError => {
  return typeof error === 'object' && error !== null && 'code' in error && error['code'] === errorCodes.InvalidCredentials;
}
