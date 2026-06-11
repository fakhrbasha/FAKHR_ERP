import { Router } from "express";
import { validation } from "../../common/middleware/validation";
import * as employeeValidation from './employee.validation'
import EmployeeService from "./employee.service";
import { authentication } from "../../common/middleware/authentication";
const employeeRouter = Router()
employeeRouter.post('/create-employee/:departmentId', authentication,
    validation(employeeValidation.createUserSchema),
    EmployeeService.createEmployee)

employeeRouter.get('/', authentication, EmployeeService.getEmployees)
employeeRouter.get('/:id', authentication, validation(employeeValidation.getEmpById), EmployeeService.getEmployeeById)
employeeRouter.delete('/:id', authentication, validation(employeeValidation.getEmpById), EmployeeService.deleteEmployee)
employeeRouter.put('/:id', authentication, validation(employeeValidation.getEmpById), EmployeeService.updateEmployee)

export default employeeRouter