import { NextFunction, Request, Response } from "express"
import AttendanceRepository from "../../DB/repository/attendance.repository"
import mongoose from "mongoose"
import { successResponse } from "../../common/utils/success.response"



class SupplierService {




    private readonly _attendanceModel = new AttendanceRepository()

    makeOrder = async (req: Request, res: Response, next: NextFunction) => {

    };
}

export default new SupplierService()