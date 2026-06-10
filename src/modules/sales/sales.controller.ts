import { Router } from "express";
import { authentication } from "../../common/middleware/authentication";
import salesService from "./sales.service";
import { validation } from "../../common/middleware/validation";
import * as salesValidation from "./sales.validation";
const salesRouter = Router()


export default salesRouter