import { NextFunction, Request, Response } from "express"
import { AppError } from "../../common/utils/global-error-handling"
import AttendanceRepository from "../../DB/repository/attendance.repository"
import { IAttendance } from "../../DB/models/attendance.model"
import { attendanceStatus } from "../../common/enums/attendance.enum"
import EmployeeRepository from "../../DB/repository/employee.repository"
import mongoose from "mongoose"
import SupplierRepository from "../../DB/repository/supplier.repository"
import { successResponse } from "../../common/utils/success.response"
import NotificationRepository from "../../DB/repository/notification.repository"



class NotificationsService {




    private readonly _attendanceModel = new AttendanceRepository()
    private readonly _employeeModel = new EmployeeRepository()
    private readonly _supplierModel = new SupplierRepository()
    private readonly _notificationModel = new NotificationRepository();
    getNotifications = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const page = Number(req.query.page) || 1;

        const limit = Number(req.query.limit) || 10;

        const searchQuery =
            req.query.search
                ? {
                    $or: [
                        {
                            title: {
                                $regex: req.query.search,
                                $options: "i"
                            }
                        },
                        {
                            message: {
                                $regex: req.query.search,
                                $options: "i"
                            }
                        }
                    ]
                }
                : {};
        const notifications =
            await this._notificationModel.paginate({
                page,
                limit,
                search: searchQuery
            });

        return successResponse({
            res,
            status: 200,
            message:
                "Notifications fetched successfully",
            data: notifications
        });
    };

    readNotification = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const { id } = req.params

        const notification = await this._notificationModel.findOne({
            filter: {
                _id: id
            }
        })
        if (!notification) {
            throw new AppError("notification not found", 404)
        }
        await this._notificationModel.update(
            { _id: id },
            { isRead: true }
        );

        successResponse({ res, message: "notification read" })


    }

    unreadCount = async (req: Request, res: Response, next: NextFunction) => {
        const count = await this._notificationModel.count({
            isRead: false
        });

        return successResponse({
            res,
            message: "unread notifications count",
            data: { count }
        });
    };
}

export default new NotificationsService()