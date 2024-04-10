import { Request, Response, NextFunction } from "express";

interface PaginationOptions {
  page?: number;
  pageSize?: number;
}

interface PrismaPaginationOptions {
  skip: number;
  take: number;
}

// Extend the Request interface to include a pagination property
declare global {
  namespace Express {
    interface Request {
      pagination?: PrismaPaginationOptions;
    }
  }
}

// Pagination middleware
const paginate = (req: Request, res: Response, next: NextFunction) => {
  const { page = 1, pageSize = 10 }: PaginationOptions = req.query;
  const skip = (page - 1) * pageSize;
  const take = pageSize;
  req.pagination = {
    skip,
    take,
  };
  next();
};

export default paginate;
