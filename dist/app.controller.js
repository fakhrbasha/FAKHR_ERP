"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const connectionDB_1 = require("./DB/connectionDB");
const global_error_handling_1 = require("./common/utils/global-error-handling");
const config_service_1 = require("./config/config.service");
const redis_service_1 = __importDefault(require("./common/services/redis.service"));
const auth_controller_1 = __importDefault(require("./modules/auth/auth.controller"));
const department_controller_1 = __importDefault(require("./modules/department/department.controller"));
const employee_controller_1 = __importDefault(require("./modules/employee/employee.controller"));
const attendance_controller_1 = __importDefault(require("./modules/Attendance/attendance.controller"));
const material_controller_1 = __importDefault(require("./modules/materials/material.controller"));
const Color_controller_1 = __importDefault(require("./modules/Color/Color.controller"));
const yarnStock_controller_1 = __importDefault(require("./modules/Stock/yarnStock.controller"));
const app = (0, express_1.default)();
const port = config_service_1.PORT || 3000;
const bootstrap = () => {
    app.use(express_1.default.json());
    (0, connectionDB_1.CheckConnectionDB)();
    redis_service_1.default.connect();
    app.use('/auth', auth_controller_1.default);
    app.use('/department', department_controller_1.default);
    app.use('/attendance', attendance_controller_1.default);
    app.use('/employee', employee_controller_1.default);
    app.use('/material', material_controller_1.default);
    app.use('/color', Color_controller_1.default);
    app.use('/yarn-stock', yarnStock_controller_1.default);
    app.get('/', (req, res) => {
        res.status(200).json({ message: "Welcome Fakhr In Your Home" });
    });
    app.use(global_error_handling_1.globalErrorHandler);
    app.use("{/*demo}", (req, res, next) => {
        throw new global_error_handling_1.AppError(`Invalid URL ${req.originalUrl} with method ${req.method} not found`, 404);
    });
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};
exports.default = bootstrap;
