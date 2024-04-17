"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getPagination = (req) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const pageSize = req.query.pageSize
        ? parseInt(req.query.pageSize)
        : 10;
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    return { skip, take };
};
exports.default = getPagination;
