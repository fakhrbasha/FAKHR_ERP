import express, { NextFunction, Request, Response } from "express";
import { CheckConnectionDB } from "./DB/connectionDB"
import { AppError, globalErrorHandler } from "./common/utils/global-error-handling";
import { PORT } from "./config/config.service";
import redisService from "./common/services/redis.service";
import authRouter from "./modules/auth/auth.controller";
import departmentRouter from "./modules/department/department.controller";
import employeeRouter from "./modules/employee/employee.controller";
import attendanceRouter from "./modules/Attendance/attendance.controller";
import materialRouter from "./modules/materials/material.controller";
const app: express.Application = express();
const port = PORT || 3000
const bootstrap = () => {
    app.use(express.json());

    CheckConnectionDB()
    redisService.connect()

    app.use('/auth', authRouter)
    app.use('/department', departmentRouter)
    app.use('/attendance', attendanceRouter)
    app.use('/employee', employeeRouter)
    app.use('/material', materialRouter)
    app.get('/', (req: Request, res: Response) => {
        res.status(200).json({ message: "Welcome Fakhr In Your Home" })
    })
    app.use(globalErrorHandler);
    app.use("{/*demo}", (req: Request, res: Response, next: NextFunction) => {
        throw new AppError(`Invalid URL ${req.originalUrl} with method ${req.method} not found`, 404)
    })
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

export default bootstrap