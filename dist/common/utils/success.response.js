"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successResponse = void 0;
const successResponse = ({ res, status = 200, message = "done", data, }) => {
    return res.status(status).json({
        success: true,
        message,
        data,
    });
};
exports.successResponse = successResponse;
