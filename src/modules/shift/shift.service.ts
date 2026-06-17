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
        const { name, startTime, endTime, workingHours } = req.body;

        const shift = await this._shiftModel.create({
            name,
            startTime,
            endTime,
            workingHours
        } as any);

        return res.status(201).json({
            success: true,
            message: "Shift created successfully",
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