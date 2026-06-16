"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const attendance_enum_1 = require("../../common/enums/attendance.enum");
const attendanceSchema = new mongoose_1.default.Schema({
    employeeId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Employee",
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date
    },
    status: {
        type: String,
        enum: attendance_enum_1.attendanceStatus,
        default: attendance_enum_1.attendanceStatus.present
    },
    overTimeHours: {
        type: Number,
        default: 0
    },
    companyId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    }
}, {
    timestamps: true,
    strict: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
const attendanceModel = mongoose_1.default.models.Attendance || mongoose_1.default.model("Attendance", attendanceSchema);
exports.default = attendanceModel;
