import { Router } from "express";
import { authentication } from "../../common/middleware/authentication";
import attendanceService from "./attendance.service";
const attendanceRouter = Router()


attendanceRouter.get('/', authentication, attendanceService.getAttendance)

attendanceRouter.post('/:employeeId', authentication, attendanceService.createAttendance)
// attendanceRouter.post('/check-out/:employeeId', authentication, attendanceService.checkOut)


export default attendanceRouter