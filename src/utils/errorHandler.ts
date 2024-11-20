import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiResponse } from './apiResponse';
import { Prisma } from '@prisma/client';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public errors: any = null
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  if (err instanceof ZodError) {
    return ApiResponse.badRequest(res, 'Validation failed', err.errors);
  }

  if (err instanceof AppError) {
    return ApiResponse.error(res, err.message, err.statusCode, err.errors);
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return ApiResponse.badRequest(res, 'Unique constraint violation');
    }
    if (err.code === 'P2025') {
      return ApiResponse.notFound(res, 'Record not found');
    }
  }

  return ApiResponse.error(res, 'Internal server error');
};
