import { ACCESS_SECRET_KEY_ADMIN, ACCESS_SECRET_KEY_USER, PREFIX_ADMIN, PREFIX_USER } from "../../config/config.service"
import { AppError } from "./global-error-handling"
import TokenService from "./jwt/jwt.service"
import userModel from "../../DB/models/user.model"
export const authFunction = async (authorization: string) => {
    interface IJwtPayload {
        id: string,
        email?: string,
    }

    if (!authorization) {
        throw new AppError("Unauthorized", 401)
    }

    const [prefix, token] = authorization.split(" ")
    let ACCESS_SECRET_KEY = ""
    if (prefix === PREFIX_USER) {
        ACCESS_SECRET_KEY = ACCESS_SECRET_KEY_USER!
    } else if (prefix === PREFIX_ADMIN) {
        ACCESS_SECRET_KEY = ACCESS_SECRET_KEY_ADMIN!
    } else {
        throw new AppError(
            "Invalid Prefix Key",
            401
        );
    }

    if (!token) {
        throw new AppError("Token not provided", 401)
    }

    const decoded = TokenService.verifyToken({ token, secretKey: ACCESS_SECRET_KEY }) as IJwtPayload

    if (!decoded?.id) {
        throw new AppError("Invalid token", 401)
    }

    const user = await userModel.findOne({ _id: decoded.id })
    if (!user) {
        throw new AppError("User not found", 404)
    }

    if (!user.isConfirmed) {
        throw new AppError("Please confirm your email", 401)
    }

    return { user, decoded }

}