"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authFunction = void 0;
const config_service_1 = require("../../config/config.service");
const global_error_handling_1 = require("./global-error-handling");
const jwt_service_1 = __importDefault(require("./jwt/jwt.service"));
const user_model_1 = __importDefault(require("../../DB/models/user.model"));
const authFunction = async (authorization) => {
    if (!authorization) {
        throw new global_error_handling_1.AppError("Unauthorized", 401);
    }
    const [prefix, token] = authorization.split(" ");
    let ACCESS_SECRET_KEY = "";
    if (prefix === config_service_1.PREFIX_USER) {
        ACCESS_SECRET_KEY = config_service_1.ACCESS_SECRET_KEY_USER;
    }
    else if (prefix === config_service_1.PREFIX_ADMIN) {
        ACCESS_SECRET_KEY = config_service_1.ACCESS_SECRET_KEY_ADMIN;
    }
    else {
        throw new global_error_handling_1.AppError("Invalid Prefix Key", 401);
    }
    if (!token) {
        throw new global_error_handling_1.AppError("Token not provided", 401);
    }
    const decoded = jwt_service_1.default.verifyToken({ token, secretKey: ACCESS_SECRET_KEY });
    if (!decoded?.id) {
        throw new global_error_handling_1.AppError("Invalid token", 401);
    }
    const user = await user_model_1.default.findOne({ _id: decoded.id });
    if (!user) {
        throw new global_error_handling_1.AppError("User not found", 404);
    }
    if (!user.isConfirmed) {
        throw new global_error_handling_1.AppError("Please confirm your email", 401);
    }
    return { user, decoded };
};
exports.authFunction = authFunction;
