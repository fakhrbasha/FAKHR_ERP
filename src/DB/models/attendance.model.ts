import mongoose, { HydratedDocument, Types, Schema } from "mongoose"
import { attendanceStatus } from "../../common/enums/attendance.enum"

export interface IAttendance {
    employeeId: Types.ObjectId,
    date: Date,
    checkIn: Date,
    checkOut?: Date,
    status: attendanceStatus,
    overTimeHours?: number,
    companyId: Types.ObjectId
}

const attendanceSchema = new mongoose.Schema<IAttendance>({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
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
        enum: attendanceStatus,
        default: attendanceStatus.present
    },
    overTimeHours: {
        type: Number,
        default: 0
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    }

}, {
    timestamps: true,
    strict: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }

})

const attendanceModel = mongoose.models.Attendance || mongoose.model<IAttendance>("Attendance", attendanceSchema)

export default attendanceModel;
export type AttendanceDocument = HydratedDocument<IAttendance>;