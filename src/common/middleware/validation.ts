import {
    NextFunction,
    Request,
    Response
} from "express";

import { ZodType } from "zod";

import { AppError } from "../utils/global-error-handling";

type ReqType = keyof Request;

type SchemaType =
    Partial<Record<ReqType, ZodType>>;

export const validation = (
    schema: SchemaType
) => {

    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const validationErrors: string[] = [];

        for (const key of Object.keys(
            schema
        ) as ReqType[]) {

            if (!schema[key]) continue;

            const result =
                schema[key]?.safeParse(req[key]);

            if (!result.success) {

                const errors =
                    result.error.issues.map(
                        (issue) => issue.message
                    );

                validationErrors.push(...errors);
            }
        }

        if (validationErrors.length > 0) {

            return res.status(400).json({
                success: false,
                errors: validationErrors
            })
        }

        next();
    };
};