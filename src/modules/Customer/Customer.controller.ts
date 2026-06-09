import { Router } from "express";
import { authentication } from "../../common/middleware/authentication";
import customerService from "./Customer.service";
import { validation } from "../../common/middleware/validation";
import * as customerValidation from "./Customer.validation";
const customerRouter = Router()

customerRouter.post('/add-customer', authentication, validation(customerValidation.createCustomerSchema), customerService.addCustomer)
customerRouter.get('/', authentication, customerService.getCustomers)
customerRouter.get('/:id', authentication, validation(customerValidation.getCustomerByIdSchema), customerService.getCustomerById)
customerRouter.delete('/delete-customer/:id', authentication, validation(customerValidation.getCustomerByIdSchema), customerService.deleteCustomer)
customerRouter.put('/update-customer/:id', authentication, validation(customerValidation.updateCustomerSchema), customerService.updateCustomer)


export default customerRouter