import { NextFunction, Request, Response } from "express";
import ShiftRepository from "../../DB/repository/shift.repository";
import { AppError } from "../../common/utils/global-error-handling";

class ShiftService {
    private readonly _shiftModel = new ShiftRepository();

    createShift = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const {
            name,
            startTime,
            endTime,
            workingHours
        } = req.body;

        if (
            !name ||
            !startTime ||
            !endTime ||
            !workingHours
        ) {
            throw new AppError(
                "All fields are required",
                400
            );
        }

        const [startHour, startMinute] =
            startTime.split(":").map(Number);

        const [endHour, endMinute] =
            endTime.split(":").map(Number);

        if (
            isNaN(startHour) ||
            isNaN(startMinute) ||
            isNaN(endHour) ||
            isNaN(endMinute)
        ) {
            throw new AppError(
                "Invalid time format. Use HH:mm",
                400
            );
        }

        const start = new Date();
        start.setHours(
            startHour,
            startMinute,
            0,
            0
        );

        const end = new Date();
        end.setHours(
            endHour,
            endMinute,
            0,
            0
        );

        if (end <= start) {
            end.setDate(end.getDate() + 1);
        }

        const calculatedHours =
            Number(
                (
                    (end.getTime() -
                        start.getTime()) /
                    (1000 * 60 * 60)
                ).toFixed(2)
            );

        if (
            Math.abs(
                calculatedHours - workingHours
            ) > 0.25
        ) {
            throw new AppError(
                `Working hours do not match shift time. Expected ${calculatedHours} hours`,
                400
            );
        }

        const shift =
            await this._shiftModel.create({
                name,
                startTime,
                endTime,
                workingHours
            } as any);

        return res.status(201).json({
            success: true,
            message:
                "Shift created successfully",
            data: shift
        });
    };

    getShifts = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const data = await this._shiftModel.paginate({
            page,
            limit,
            sort: { createdAt: -1 }
        });

        return res.status(200).json({
            success: true,
            message: "Shifts fetched successfully",
            data
        });
    };

    getShiftById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const { id } = req.params;

        const shift = await this._shiftModel.findById(id as any);

        if (!shift) {
            throw new AppError("Shift not found", 404);
        }

        return res.status(200).json({
            success: true,
            message: "Shift fetched successfully",
            data: shift
        });
    };

    updateShift = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const { id } = req.params;

        const shift = await this._shiftModel.update(
            { _id: id },
            req.body
        );

        if (!shift) {
            throw new AppError("Shift not found", 404);
        }

        return res.status(200).json({
            success: true,
            message: "Shift updated successfully",
            data: shift
        });
    };

    deleteShift = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const { id } = req.params;

        const shift = await this._shiftModel.delete(id as any);

        if (!shift) {
            throw new AppError("Shift not found", 404);
        }

        return res.status(200).json({
            success: true,
            message: "Shift deleted successfully"
        });
    };
}

export default new ShiftService();