import { Response } from 'express';

export class ApiResponse {
  static success(res: Response, data: any = null, message: string = 'Success', status: number = 200) {
    return res.status(status).json({
      success: true,
      message,
      data,
    });
  }

  static error(res: Response, message: string = 'Internal server error', status: number = 500, errors: any = null) {
    return res.status(status).json({
      success: false,
      message,
      errors,
    });
  }

  static created(res: Response, data: any = null, message: string = 'Resource created successfully') {
    return this.success(res, data, message, 201);
  }

  static notFound(res: Response, message: string = 'Resource not found') {
    return this.error(res, message, 404);
  }

  static badRequest(res: Response, message: string = 'Bad request', errors: any = null) {
    return this.error(res, message, 400, errors);
  }

  static unauthorized(res: Response, message: string = 'Unauthorized') {
    return this.error(res, message, 401);
  }
}
