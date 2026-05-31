"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_1 = require("../../common/middleware/authentication");
const attendance_service_1 = __importDefault(require("./attendance.service"));
const attendanceRouter = (0, express_1.Router)();
attendanceRouter.get('/', authentication_1.authentication, attendance_service_1.default.getAttendance);
attendanceRouter.post('/check-in/:employeeId', authentication_1.authentication, attendance_service_1.default.checkIn);
attendanceRouter.post('/check-out/:employeeId', authentication_1.authentication, attendance_service_1.default.checkOut);
exports.default = attendanceRouter;
