import { ErrorCode } from "./codes";

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly meta?: any;
  public readonly isOperational: boolean;

  constructor(code: ErrorCode, message: string, meta?: any, isOperational = true) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.meta = meta;
    this.isOperational = isOperational;
    
    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}
