import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/global-error-handling";
import { RoleEnum } from "../enums/user.enum";

export const authorization = (
    ...roles: RoleEnum[]
) => {

    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        if (!req.user) {
            throw new AppError(
                "Unauthorized",
                401
            );
        }

        if (
            !roles.includes(req.user.role!)
        ) {
            throw new AppError(
                "Forbidden",
                403
            );
        }

        next();
    };
};