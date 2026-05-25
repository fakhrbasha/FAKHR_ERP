"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtp = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_service_1 = require("../../../config/config.service");
const sendEmail = async (mailOptions) => {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: config_service_1.GMAIL_USER,
            pass: config_service_1.GMAIL_PASS
        },
    });
    const info = await transporter.sendMail({
        from: `"VOLCANO "<${config_service_1.GMAIL_USER}>`,
        ...mailOptions
    });
    return info.accepted.length ? true : false;
};
exports.sendEmail = sendEmail;
const sendOtp = async () => {
    return Math.floor(100000 + Math.random() * 900000);
};
exports.sendOtp = sendOtp;
