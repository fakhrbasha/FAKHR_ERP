import { NextFunction, Request, Response } from "express"
import { authFunction } from "../utils/authFunction"

export const authentication = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers

    const { user, decoded } = await authFunction(authorization!)

    req.user = user
    req.decoded = decoded

    next()
}