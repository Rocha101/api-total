import { Request } from "express";

const getPagination = (req: Request) => {
  const page = req.query.page ? parseInt(req.query.page as string) : 1;
  const pageSize = req.query.pageSize
    ? parseInt(req.query.pageSize as string)
    : 10;
  const skip = (page - 1) * pageSize;
  const take = pageSize;
  return { skip, take };
};

export default getPagination;
