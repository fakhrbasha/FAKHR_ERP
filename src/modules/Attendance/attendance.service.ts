import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

import AttendanceRepository from "../../DB/repository/attendance.repository";
import EmployeeRepository from "../../DB/repository/employee.repository";
import ShiftRepository from "../../DB/repository/shift.repository";

import { AppError } from "../../common/utils/global-error-handling";
import { attendanceStatus } from "../../common/enums/attendance.enum";

class AttendanceService {

    private readonly _attendanceModel =
        new AttendanceRepository();

    private readonly _employeeModel =
        new EmployeeRepository();

    private readonly _shiftModel =
        new ShiftRepository();

    // checkIn = async (
    //     req: Request,
    //     res: Response,
    //     next: NextFunction
    // ) => {

    //     const { employeeId } = req.params;
    //     if (Array.isArray(employeeId)) {

    //         throw new AppError("Invalid employee id", 400);

    //     }
    //     if (!mongoose.Types.ObjectId.isValid(employeeId)) {
    //         throw new AppError(
    //             "Invalid employee id",
    //             400
    //         );
    //     }

    //     const employee =
    //         await this._employeeModel.findOne({
    //             filter: {
    //                 _id: employeeId
    //             }
    //         });

    //     if (!employee) {
    //         throw new AppError(
    //             "Employee not found",
    //             404
    //         );
    //     }

    //     const shift =
    //         await this._shiftModel.findById(
    //             employee.shiftId
    //         );

    //     if (!shift) {
    //         throw new AppError(
    //             "Shift not found",
    //             404
    //         );
    //     }

    //     const startOfDay = new Date();
    //     startOfDay.setHours(0, 0, 0, 0);

    //     const endOfDay = new Date();
    //     endOfDay.setHours(23, 59, 59, 999);

    //     const alreadyCheckedIn =
    //         await this._attendanceModel.findOne({
    //             filter: {
    //                 employeeId,
    //                 date: {
    //                     $gte: startOfDay,
    //                     $lte: endOfDay
    //                 }
    //             }
    //         });

    //     if (alreadyCheckedIn) {
    //         throw new AppError(
    //             "Employee already checked in today",
    //             409
    //         );
    //     }

    //     const now = new Date();

    //     const [hours, minutes] =
    //         shift.startTime
    //             .split(":")
    //             .map(Number);

    //     const shiftStart = new Date();

    //     shiftStart.setHours(
    //         hours,
    //         minutes,
    //         0,
    //         0
    //     );

    //     const lateMinutes =
    //         Math.max(
    //             0,
    //             Math.floor(
    //                 (
    //                     now.getTime() -
    //                     shiftStart.getTime()
    //                 ) /
    //                 (1000 * 60)
    //             )
    //         );

    //     const status =
    //         lateMinutes > 0
    //             ? attendanceStatus.late
    //             : attendanceStatus.present;

    //     const attendance =
    //         await this._attendanceModel.create({
    //             employeeId:
    //                 new mongoose.Types.ObjectId(
    //                     employeeId
    //                 ),

    //             date: now,

    //             checkIn: now,

    //             lateMinutes,

    //             status
    //         });

    //     return res.status(201).json({
    //         success: true,
    //         message:
    //             "Check in successful",
    //         data: attendance
    //     });
    // };

    // checkOut = async (
    //     req: Request,
    //     res: Response,
    //     next: NextFunction
    // ) => {

    //     const { employeeId } = req.params;
    //     if (Array.isArray(employeeId)) {

    //         throw new AppError("Invalid employee id", 400);

    //     }
    //     if (!mongoose.Types.ObjectId.isValid(employeeId)) {
    //         throw new AppError(
    //             "Invalid employee id",
    //             400
    //         );
    //     }

    //     const employee =
    //         await this._employeeModel.findOne({
    //             filter: {
    //                 _id: employeeId
    //             }
    //         });

    //     if (!employee) {
    //         throw new AppError(
    //             "Employee not found",
    //             404
    //         );
    //     }

    //     const shift =
    //         await this._shiftModel.findById(
    //             employee.shiftId
    //         );

    //     if (!shift) {
    //         throw new AppError(
    //             "Shift not found",
    //             404
    //         );
    //     }

    //     const startOfDay = new Date();
    //     startOfDay.setHours(0, 0, 0, 0);

    //     const endOfDay = new Date();
    //     endOfDay.setHours(23, 59, 59, 999);

    //     const attendance =
    //         await this._attendanceModel.findOne({
    //             filter: {
    //                 employeeId,
    //                 date: {
    //                     $gte: startOfDay,
    //                     $lte: endOfDay
    //                 }
    //             }
    //         });

    //     if (!attendance) {
    //         throw new AppError(
    //             "Employee did not check in today",
    //             404
    //         );
    //     }

    //     if (attendance.checkOut) {
    //         throw new AppError(
    //             "Employee already checked out",
    //             409
    //         );
    //     }

    //     const now = new Date();

    //     const workedHours =
    //         Number(
    //             (
    //                 (
    //                     now.getTime() -
    //                     attendance.checkIn.getTime()
    //                 ) /
    //                 (1000 * 60 * 60)
    //             ).toFixed(2)
    //         );

    //     const overtimeHours =
    //         workedHours >
    //             shift.workingHours
    //             ? Number(
    //                 (
    //                     workedHours -
    //                     shift.workingHours
    //                 ).toFixed(2)
    //             )
    //             : 0;

    //     const missingHours =
    //         workedHours <
    //             shift.workingHours
    //             ? Number(
    //                 (
    //                     shift.workingHours -
    //                     workedHours
    //                 ).toFixed(2)
    //             )
    //             : 0;

    //     const updatedAttendance =
    //         await this._attendanceModel.update(
    //             {
    //                 _id:
    //                     attendance._id
    //             },
    //             {
    //                 checkOut: now,
    //                 workedHours,
    //                 overtimeHours,
    //                 missingHours
    //             }
    //         );

    //     return res.status(200).json({
    //         success: true,
    //         message:
    //             "Check out successful",
    //         data:
    //             updatedAttendance
    //     });
    // };
    getAttendance = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const search = req.query.search?.toString();

        const searchQuery = search
            ? {
                $or: [
                    {
                        status: {
                            $regex: search,
                            $options: "i"
                        }
                    }
                ]
            }
            : {};

        const attendance =
            await this._attendanceModel.paginate({
                page,
                limit,
                search: searchQuery,
                sort: {
                    date: -1
                },
                populate: [
                    {
                        path: "employeeId",
                        select:
                            "fullName phone role shiftId",
                        populate: {
                            path: "shiftId",
                            select:
                                "name startTime endTime workingHours"
                        }
                    }
                ]
            });

        return res.status(200).json({
            success: true,
            message:
                "Attendance retrieved successfully",
            data: attendance
        });
    };

    createAttendance = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const { checkIn, checkOut } = req.body;
        const { employeeId } = req.params
        if (Array.isArray(employeeId)) {

            throw new AppError("Invalid employee id", 400);

        }
        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            throw new AppError("Invalid employee id", 400);
        }

        const employee = await this._employeeModel.findOne({
            filter: { _id: employeeId },
            options: {
                populate: "shiftId"
            }
        });

        if (!employee) {
            throw new AppError("Employee not found", 404);
        }

        const shift = employee.shiftId as any;

        if (!shift) {
            throw new AppError("Shift not assigned", 400);
        }
        if (!checkIn || !checkOut) {
            throw new AppError("checkIn and checkOut are required", 400);
        }
        const parseTimeToDate = (time: string) => {
            const [hours, minutes] = time.split(":").map(Number);

            if (isNaN(hours) || isNaN(minutes)) {
                throw new AppError("Invalid time format (use HH:mm)", 400);
            }

            const date = new Date();
            date.setHours(hours, minutes, 0, 0);

            return date;
        };
        const start = parseTimeToDate(checkIn);
        const end = parseTimeToDate(checkOut);
        if (end <= start) {
            end.setDate(end.getDate() + 1);
        }
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new AppError("Invalid date format", 400);
        }
        if (end < start) {
            throw new AppError("CheckOut cannot be before CheckIn", 400);
        }

        const [shiftStartH, shiftStartM] = shift.startTime.split(":").map(Number);
        const [shiftEndH, shiftEndM] = shift.endTime.split(":").map(Number);

        const shiftStart = new Date(start);
        shiftStart.setHours(shiftStartH, shiftStartM, 0, 0);

        const shiftEnd = new Date(start);
        shiftEnd.setHours(shiftEndH, shiftEndM, 0, 0);


        const diffMs = end.getTime() - start.getTime();

        if (diffMs < 0) {
            throw new AppError("checkOut cannot be before checkIn", 400);
        }

        const workedHours = diffMs / (1000 * 60 * 60);
        const expectedHours =
            (shiftEnd.getTime() - shiftStart.getTime()) / (1000 * 60 * 60);

        const lateMinutes = Math.max(
            0,
            (start.getTime() - shiftStart.getTime()) / (1000 * 60)
        );
        const overtimeHours =
            workedHours > expectedHours
                ? workedHours - expectedHours
                : 0;

        const missingHours =
            workedHours < expectedHours
                ? expectedHours - workedHours
                : 0;

        let status: attendanceStatus;

        if (workedHours === 0) {
            status = attendanceStatus.absent;
        } else if (start > shiftStart) {
            status = attendanceStatus.late;
        } else {
            status = attendanceStatus.present;
        }
        const attendance = await this._attendanceModel.create({
            employeeId,
            checkIn: start,
            checkOut: end,
            date: new Date(),

            workedHours: Number(workedHours.toFixed(2)),
            overtimeHours: Number(overtimeHours.toFixed(2)),
            missingHours: Number(missingHours.toFixed(2)),
            lateMinutes: Number(lateMinutes.toFixed(0)),

            status,
            companyId: employee.companyId
        } as any);

        return res.status(201).json({
            success: true,
            message: "Attendance created successfully",
            data: attendance
        });
    };
}

export default new AttendanceService();