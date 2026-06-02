import { Response } from "express";

interface SuccessResponseParams {
    res: Response;
    status?: number;
    message?: string;
    data?: any;
}

export const successResponse = ({
    res,
    status = 200,
    message = "done",
    data,
}: SuccessResponseParams) => {
    return res.status(status).json({
        success: true,
        message,
        data,
    });
};