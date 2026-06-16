import { NextFunction, Request, Response } from "express"
import { authFunction } from "../utils/authFunction"
import { tenantStorage } from "../services/tenant.storage"

export const authentication = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers

    const { user, decoded } = await authFunction(authorization!)

    req.user = user
    req.decoded = decoded

    if (user && user.companyId) {
        tenantStorage.run(user.companyId.toString(), () => {
            next()
        })
    } else {
        next()
    }
}