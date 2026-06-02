import { NextFunction, Request, Response } from "express"
import { AppError } from "../../common/utils/global-error-handling"
import AttendanceRepository from "../../DB/repository/attendance.repository"
import { IAttendance } from "../../DB/models/attendance.model"
import { attendanceStatus } from "../../common/enums/attendance.enum"
import EmployeeRepository from "../../DB/repository/employee.repository"
import mongoose from "mongoose"
import ColorRepository from "../../DB/repository/color.repository"
import { IColor } from "../../DB/models/color.model"
import { successResponse } from "../../common/utils/success.response"



class ColorService {




    private readonly _colorModel = new ColorRepository()

    addColor = async (req: Request, res: Response, next: NextFunction) => {
        const { name, hexCode }: IColor = req.body

        const isColor = await this._colorModel.findOne({
            filter: {
                $or: [
                    { name },
                    { hexCode }
                ]
            }
        })

        if (isColor) {
            throw new AppError("Color is already exist", 409)
        }

        const color = await this._colorModel.create({
            name,
            hexCode
        })

        // return res.status(201).json({
        //     success: true,
        //     message: "Color Added success",
        //     data: color
        // })
        successResponse({ res, status: 201, message: "Color Added success", data: color })
    }


    getColors = async (req: Request, res: Response, next: NextFunction) => {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const searchQuery = req.query.search
            ? {
                name: {
                    $regex: req.query.search,
                    $options: "i"
                }
            }
            : {};

        const colors = await this._colorModel.paginate({
            page,
            limit,
            search: searchQuery,
        });

        if (!colors.data.length) {
            throw new AppError("No Colors Found", 404);
        }

        successResponse({
            res,
            data: colors,
            message: "Colors Retrieved Successfully"
        });
    }

    // edit color

    editColor = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params
        const { name, hexCode } = req.body

        const isColor = await this._colorModel.findOne({
            filter: {
                _id: id
            }
        })

        if (!isColor) {
            throw new AppError("Color not found", 404)
        }
        if (isColor.name === undefined) {
            isColor.name = name
        }
        if (isColor.hexCode === undefined) {
            isColor.hexCode = hexCode
        }
        const updatedColor = await this._colorModel.update({ _id: id }, { name, hexCode })

        if (!updatedColor) {
            throw new AppError("Failed to update color", 500)
        }
        successResponse({ res, message: "Color updated successfully", data: updatedColor })
    }

    // delete color
    deleteColor = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params
        const isColor = await this._colorModel.findOne({
            filter: {
                _id: id
            }
        })

        if (!isColor) {
            throw new AppError("Color not found", 404)
        }

        const deletedColor = await this._colorModel.delete(isColor._id)
        if (!deletedColor) {
            throw new AppError("Failed to delete color", 500)
        }
        successResponse({ res, message: "Color deleted successfully" })

    }


}

export default new ColorService()