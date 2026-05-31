import { Model } from "mongoose";
import BaseRepository from "./base.repository";
import attendanceModel, { IAttendance } from "../models/attendance.model";


class AttendanceRepository extends BaseRepository<IAttendance> {
    constructor(protected readonly model: Model<IAttendance> = attendanceModel) {
        super(model)
    }
}

export default AttendanceRepository