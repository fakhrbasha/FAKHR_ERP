"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentication = void 0;
const authFunction_1 = require("../utils/authFunction");
const tenant_storage_1 = require("../services/tenant.storage");
const authentication = async (req, res, next) => {
    const { authorization } = req.headers;
    const { user, decoded } = await (0, authFunction_1.authFunction)(authorization);
    req.user = user;
    req.decoded = decoded;
    if (user && user.companyId) {
        tenant_storage_1.tenantStorage.run(user.companyId.toString(), () => {
            next();
        });
    }
    else {
        next();
    }
};
exports.authentication = authentication;
