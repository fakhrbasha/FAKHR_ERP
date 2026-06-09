import multer, {
    FileFilterCallback
} from "multer";

import fs from "node:fs";
import { Request } from "express";

interface IMulterOptions {
    custom_path?: string;
    custom_type?: string[];
}

export const multer_local = ({
    custom_path = "General",
    custom_type = []
}: IMulterOptions) => {

    const full_path = `upload/${custom_path}`;

    if (!fs.existsSync(full_path)) {
        fs.mkdirSync(full_path, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: (
            req: Request,
            file: Express.Multer.File,
            cb
        ) => {
            cb(null, full_path);
        },

        filename: (
            req: Request,
            file: Express.Multer.File,
            cb
        ) => {
            const uniqueSuffix =
                Date.now() +
                "-" +
                Math.round(Math.random() * 1e9);

            cb(
                null,
                `${uniqueSuffix}__${file.originalname}`
            );
        }
    });

    const fileFilter = (
        req: Request,
        file: Express.Multer.File,
        cb: FileFilterCallback
    ) => {

        if (
            custom_type.length &&
            !custom_type.includes(file.mimetype)
        ) {
            return cb(
                new Error("Invalid File Type")
            );
        }

        cb(null, true);
    };

    return multer({
        storage,
        fileFilter
    });
};

export const multer_host = ({
    custom_type = []
}: IMulterOptions) => {

    const storage = multer.memoryStorage();

    const fileFilter = (
        req: Request,
        file: Express.Multer.File,
        cb: FileFilterCallback
    ) => {

        if (
            custom_type.length &&
            !custom_type.includes(file.mimetype)
        ) {
            return cb(
                new Error("Invalid File Type")
            );
        }

        cb(null, true);
    };

    return multer({
        storage,
        fileFilter
    });
};

