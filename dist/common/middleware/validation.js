"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validation = void 0;
const validation = (schema) => {
    return (req, res, next) => {
        const validationErrors = [];
        for (const key of Object.keys(schema)) {
            if (!schema[key])
                continue;
            const result = schema[key]?.safeParse(req[key]);
            if (!result.success) {
                const errors = result.error.issues.map((issue) => issue.message);
                validationErrors.push(...errors);
            }
        }
        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                errors: validationErrors
            });
        }
        next();
    };
};
exports.validation = validation;
