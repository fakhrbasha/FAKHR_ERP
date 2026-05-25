import { confirmEmailSchema, forgetPasswordSchema, loginSchema, registerSchema, resendOtpSchema, resetPasswordSchema } from "./auth.validation";
import z from "zod";
export type IRegisterType = z.infer<typeof registerSchema.body>
export type IConfirmEmailType = z.infer<typeof confirmEmailSchema.body>
export type ILoginType = z.infer<typeof loginSchema.body>
export type IResendOtpType = z.infer<typeof resendOtpSchema.body>
export type IForgetPasswordType = z.infer<typeof forgetPasswordSchema.body>
export type IResetPasswordType = z.infer<typeof resetPasswordSchema.body>