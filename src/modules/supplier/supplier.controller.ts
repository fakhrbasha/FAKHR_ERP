import { Router } from "express";
import { authentication } from "../../common/middleware/authentication";
import supplierService from "./supplier.service";
import { validation } from "../../common/middleware/validation";
import * as supplierValidation from "./supplier.validation";
const supplierRouter = Router()

supplierRouter.post("/", authentication, validation(supplierValidation.createSupplierSchema), supplierService.addSupplier)
supplierRouter.get("/", authentication, supplierService.getAllSuppliers)
supplierRouter.get("/:id", authentication, validation(supplierValidation.getSupplierByIdSchema), supplierService.getSupplierById)
supplierRouter.put("/:id", authentication, validation(supplierValidation.updateSupplierSchema), supplierService.updateSupplier)
supplierRouter.delete("/:id", authentication, validation(supplierValidation.getSupplierByIdSchema), supplierService.deleteSupplier)

export default supplierRouter