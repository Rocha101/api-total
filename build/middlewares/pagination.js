"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Pagination middleware
const paginate = (req, res, next) => {
    const { page = 1, pageSize = 10 } = req.query;
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    req.pagination = {
        skip,
        take,
    };
    next();
};
exports.default = paginate;
