import { Router } from "express";
import { validation } from "../../common/middleware/validation";
import * as materialValidation from './material.validation'
import { authentication } from "../../common/middleware/authentication";
import materialService from "./material.service";
const materialRouter = Router()

materialRouter.post('/', authentication, validation(materialValidation.addMaterialSchema), materialService.addMaterial)
materialRouter.get('/', authentication, materialService.getMaterials)
materialRouter.put('/:id', authentication, validation(materialValidation.updateMaterialSchema), materialService.updateMaterial)
materialRouter.delete('/:id', authentication, validation(materialValidation.getMaterialSchemaById), materialService.deleteMaterial)
materialRouter.get('/:id', authentication, validation(materialValidation.getMaterialSchemaById), materialService.getMaterialById)


export default materialRouter