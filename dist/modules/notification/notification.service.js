"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const global_error_handling_1 = require("../../common/utils/global-error-handling");
const attendance_repository_1 = __importDefault(require("../../DB/repository/attendance.repository"));
const employee_repository_1 = __importDefault(require("../../DB/repository/employee.repository"));
const supplier_repository_1 = __importDefault(require("../../DB/repository/supplier.repository"));
const success_response_1 = require("../../common/utils/success.response");
const notification_repository_1 = __importDefault(require("../../DB/repository/notification.repository"));
class NotificationsService {
    _attendanceModel = new attendance_repository_1.default();
    _employeeModel = new employee_repository_1.default();
    _supplierModel = new supplier_repository_1.default();
    _notificationModel = new notification_repository_1.default();
    getNotifications = async (req, res, next) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const searchQuery = req.query.search
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
        const notifications = await this._notificationModel.paginate({
            page,
            limit,
            search: searchQuery
        });
        return (0, success_response_1.successResponse)({
            res,
            status: 200,
            message: "Notifications fetched successfully",
            data: notifications
        });
    };
    readNotification = async (req, res, next) => {
        const { id } = req.params;
        const notification = await this._notificationModel.findOne({
            filter: {
                _id: id
            }
        });
        if (!notification) {
            throw new global_error_handling_1.AppError("notification not found", 404);
        }
        await this._notificationModel.update({ _id: id }, { isRead: true });
        (0, success_response_1.successResponse)({ res, message: "notification read" });
    };
    unreadCount = async (req, res, next) => {
        const count = await this._notificationModel.count({
            isRead: false
        });
        return (0, success_response_1.successResponse)({
            res,
            message: "unread notifications count",
            data: { count }
        });
    };
}
exports.default = new NotificationsService();
