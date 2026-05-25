import * as z from "zod"
import { RoleEnum } from "../../common/enums/user.enum"

export const registerSchema = {
    body: z.object({
        userName: z.string({ error: "userName is required" }).min(3).max(25),
        password: z.string({ error: "password is required" }).min(6),
        email: z.string({ error: "email is required" }).email(),
        confirmPassword: z.string({ error: "confirm password  is required" }).min(6),
        phone: z.string().min(10).max(15).optional(),
        isConfirmed: z.boolean().optional(),
        role: z.enum(RoleEnum)
    }).refine((data) => {
        return data.password === data.confirmPassword
    }, {
        message: "password and confirm password must be the same",
        path: ["confirmPassword"]
    })
}

export const confirmEmailSchema = {
    body: z.object({
        otp: z.string(),
        email: z.string().email()
    })
}

export const loginSchema = {
    body: z.object({
        email: z.string().email(),
        password: z.string()
    })
}
export const resendOtpSchema = {
    body: z.object({
        email: z.string().email()
    })
}

export const forgetPasswordSchema = {
    body: z.object({
        email: z.string().email()
    })
}
export const resetPasswordSchema = {
    body: z.object({
        email: z.string().email(),
        otp: z.string(),
        newPassword: z.string()
    })
}

export const updatePasswordSchema = {
    body: z.object({
        oldPassword: z.string(),
        newPassword: z.string()
    })
}
