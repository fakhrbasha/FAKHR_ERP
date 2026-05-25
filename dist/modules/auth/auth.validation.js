"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePasswordSchema = exports.resetPasswordSchema = exports.forgetPasswordSchema = exports.resendOtpSchema = exports.loginSchema = exports.confirmEmailSchema = exports.registerSchema = void 0;
const z = __importStar(require("zod"));
const user_enum_1 = require("../../common/enums/user.enum");
exports.registerSchema = {
    body: z.object({
        userName: z.string({ error: "userName is required" }).min(3).max(25),
        password: z.string({ error: "password is required" }).min(6),
        email: z.string({ error: "email is required" }).email(),
        confirmPassword: z.string({ error: "confirm password  is required" }).min(6),
        phone: z.string().min(10).max(15).optional(),
        isConfirmed: z.boolean().optional(),
        role: z.enum(user_enum_1.RoleEnum)
    }).refine((data) => {
        return data.password === data.confirmPassword;
    }, {
        message: "password and confirm password must be the same",
        path: ["confirmPassword"]
    })
};
exports.confirmEmailSchema = {
    body: z.object({
        otp: z.string(),
        email: z.string().email()
    })
};
exports.loginSchema = {
    body: z.object({
        email: z.string().email(),
        password: z.string()
    })
};
exports.resendOtpSchema = {
    body: z.object({
        email: z.string().email()
    })
};
exports.forgetPasswordSchema = {
    body: z.object({
        email: z.string().email()
    })
};
exports.resetPasswordSchema = {
    body: z.object({
        email: z.string().email(),
        otp: z.string(),
        newPassword: z.string()
    })
};
exports.updatePasswordSchema = {
    body: z.object({
        oldPassword: z.string(),
        newPassword: z.string()
    })
};
