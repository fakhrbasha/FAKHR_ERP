import { Router } from "express";
import { validation } from "../../common/middleware/validation";
import * as userValidation from "./auth.validation";
import UserService from './auth.service'
import { authentication } from "../../common/middleware/authentication";
const authRouter = Router()

authRouter.post("/register", validation(userValidation.registerSchema), UserService.register)
authRouter.post("/confirm-email", validation(userValidation.confirmEmailSchema), UserService.confirmEmail)
authRouter.post("/login", validation(userValidation.loginSchema), UserService.login)
authRouter.post("/resend-otp", validation(userValidation.resendOtpSchema), UserService.resendOtp)
authRouter.post('/forget-password', validation(userValidation.forgetPasswordSchema), UserService.forgetPassword)
authRouter.post('/reset-password', validation(userValidation.resetPasswordSchema), UserService.resetPassword)
authRouter.post('/update-password', authentication, validation(userValidation.updatePasswordSchema), UserService.updatePassword)
authRouter.post('/logout', authentication, UserService.logOut)

export default authRouter