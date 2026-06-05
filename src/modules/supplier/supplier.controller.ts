import { Router } from "express";
import { authentication } from "../../common/middleware/authentication";
import supplierService from "./supplier.service";
import { validation } from "../../common/middleware/validation";
import * as supplierValidation from "./supplier.validation";
const supplierRouter = Router()

supplierRouter.post("/add-supplier", authentication, validation(supplierValidation.createSupplierSchema), supplierService.addSupplier)
supplierRouter.get("/get-suppliers", authentication, supplierService.getAllSuppliers)
supplierRouter.get("/get-supplier/:id", authentication, validation(supplierValidation.getSupplierByIdSchema), supplierService.getSupplierById)
supplierRouter.put("/update-supplier/:id", authentication, validation(supplierValidation.updateSupplierSchema), supplierService.updateSupplier)
supplierRouter.delete("/delete-supplier/:id", authentication, validation(supplierValidation.getSupplierByIdSchema), supplierService.deleteSupplier)

export default supplierRouter