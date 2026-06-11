import { Router } from "express";
import { validation } from "../../common/middleware/validation";
import * as departmentValidation from './department.validation'
import { authentication } from "../../common/middleware/authentication";
import departmentService from "./department.service";
const departmentRouter = Router()
departmentRouter.post('/',
    authentication,
    validation(departmentValidation.createDepartmentSchema),
    departmentService.createDepartment)
departmentRouter.get('/',
    authentication,
    departmentService.getAllDepartments)
departmentRouter.get('/:id',
    authentication,
    validation(departmentValidation.getDeptSchemaById),
    departmentService.getAllDepartments)


departmentRouter.put('/:id',
    authentication,
    validation(departmentValidation.createDepartmentSchema),
    departmentService.updateDepartment)

departmentRouter.delete('/:id',
    authentication,
    validation(departmentValidation.getDeptSchemaById),
    departmentService.deleteDepartment)



export default departmentRouter