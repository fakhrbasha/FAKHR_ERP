import { NextFunction, Request, Response } from "express"
import { AppError } from "../../common/utils/global-error-handling"
import AttendanceRepository from "../../DB/repository/attendance.repository"
import { IAttendance } from "../../DB/models/attendance.model"
import { attendanceStatus } from "../../common/enums/attendance.enum"
import EmployeeRepository from "../../DB/repository/employee.repository"
import mongoose from "mongoose"



class AttendanceService {




    private readonly _attendanceModel = new AttendanceRepository()
    private readonly _employeeModel = new EmployeeRepository()

    checkIn = async (req: Request, res: Response, next: NextFunction) => {
        const { employeeId } = req.params
        // const { date, checkIn, checkOut, status = attendanceStatus.present, overTimeHours = 0 }: IAttendance = req.body
        if (Array.isArray(employeeId)) {
            throw new AppError("Invalid employee id", 400);
        }
        // if (!mongoose.Types.ObjectId.isValid(employeeId)) {
        //     throw new AppError("Invalid employee id", 400);
        // }
        // const now = new Date()
        // const shiftStartHour = 10
        // if (now.getHours() >= shiftStartHour) {
        //     status = attendanceStatus.late;
        // } else {
        //     status = attendanceStatus.present;
        // }
        const isEmployeeExist = await this._employeeModel.findOne({ filter: { _id: employeeId } })
        if (!isEmployeeExist) {
            throw new AppError("Employee not found", 404)
        }
        const startOfDay = new Date()
        startOfDay.setHours(0, 0, 0, 0)
        const endOfDay = new Date()
        endOfDay.setHours(23, 59, 59, 999)

        // ensure if employee already checkIn

        const isAlreadyCheckIn = await this._attendanceModel.findOne({
            filter: {
                employeeId,
                date: {
                    $gte: startOfDay,
                    $lte: endOfDay
                }
            },

        })
        if (isAlreadyCheckIn) {
            throw new AppError(
                "Employee already checked in today",
                409
            );
        }
        const attendance = await this._attendanceModel.create({
            employeeId: new mongoose.Types.ObjectId(employeeId),
            date: new Date(),
            checkIn: new Date(),
            status: attendanceStatus.present
        })
        return res.status(201).json({
            success: true,
            message: "Check in successful",
            data: attendance
        });
    }

    checkOut = async (req: Request, res: Response, next: NextFunction) => {
        const { employeeId } = req.params
        if (Array.isArray(employeeId)) {
            throw new AppError("Invalid employee id", 400);
        }
        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            throw new AppError("Invalid employee id", 400);
        }
        const employee = await this._employeeModel.findOne({ filter: { _id: employeeId } })
        if (!employee) {
            throw new AppError("Employee not found", 404)
        }

        const startOfDay = new Date()
        startOfDay.setHours(0, 0, 0, 0)

        const endOfDay = new Date()
        endOfDay.setHours(23, 59, 59, 999)

        const attendance = await this._attendanceModel.findOne({
            filter: {
                employeeId, date: {
                    $gte: startOfDay,
                    $lte: endOfDay
                }
            }
        })
        if (!attendance) {
            throw new AppError(
                "Employee did not check in today",
                404
            );
        }
        if (attendance.checkOut) {
            throw new AppError("Employee Already Checked Out", 409)
        }
        const now = new Date()

        const workedHours = (now.getTime() - attendance.checkIn.getTime()) / (1000 * 60 * 60)

        const overTimeHours = workedHours > 12 ? Number((workedHours - 12).toFixed(2)) : 0

        const updatedAttendance = await this._attendanceModel.update
            ({ _id: attendance._id },
                { checkOut: now, overTimeHours: overTimeHours })

        return res.status(200).json({
            success: true,
            message: "Check out successful",
            data: updatedAttendance
        });
    }

    getAttendance = async (req: Request, res: Response, next: NextFunction) => {
        const data = await this._attendanceModel.find({ filter: {} })

        return res.status(200).json({
            success: true,
            message: "Attendance Retrieved Success",
            data
        })
    }


}

export default new AttendanceService()