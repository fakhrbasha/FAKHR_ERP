import { Router } from "express";
import { validation } from "../../common/middleware/validation";
import * as departmentValidation from './department.validation'
import { authentication } from "../../common/middleware/authentication";
import departmentService from "./department.service";
const departmentRouter = Router()
departmentRouter.post('/create-department',
    authentication,
    validation(departmentValidation.createDepartmentSchema),
    departmentService.createDepartment)
departmentRouter.get('/all-departments',
    authentication,
    departmentService.getAllDepartments)
departmentRouter.get('/:id',
    authentication,
    validation(departmentValidation.getDeptSchemaById),
    departmentService.getAllDepartments)


departmentRouter.put('/update-department/:id',
    authentication,
    validation(departmentValidation.createDepartmentSchema),
    departmentService.updateDepartment)

departmentRouter.delete('/delete-department/:id',
    authentication,
    validation(departmentValidation.getDeptSchemaById),
    departmentService.deleteDepartment)



export default departmentRouter