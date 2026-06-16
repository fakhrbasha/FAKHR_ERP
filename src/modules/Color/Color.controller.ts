import { Router } from "express";
import { authentication } from "../../common/middleware/authentication";
import { validation } from "../../common/middleware/validation";
import * as colorValidation from "./Color.validation";
import ColorService from "./Color.service";
const colorRouter = Router()


colorRouter.post('/', authentication, validation(colorValidation.addColorSchema), ColorService.addColor)
colorRouter.get('/', authentication, ColorService.getColors)
colorRouter.get('/:id', authentication, ColorService.getColorById)
colorRouter.put('/:id', authentication, validation(colorValidation.updateColorSchema), ColorService.editColor)
colorRouter.delete('/:id', authentication, ColorService.deleteColor)

export default colorRouter