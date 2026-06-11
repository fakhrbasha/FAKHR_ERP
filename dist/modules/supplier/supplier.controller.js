"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_1 = require("../../common/middleware/authentication");
const supplier_service_1 = __importDefault(require("./supplier.service"));
const validation_1 = require("../../common/middleware/validation");
const supplierValidation = __importStar(require("./supplier.validation"));
const supplierRouter = (0, express_1.Router)();
supplierRouter.post("/", authentication_1.authentication, (0, validation_1.validation)(supplierValidation.createSupplierSchema), supplier_service_1.default.addSupplier);
supplierRouter.get("/", authentication_1.authentication, supplier_service_1.default.getAllSuppliers);
supplierRouter.get("/:id", authentication_1.authentication, (0, validation_1.validation)(supplierValidation.getSupplierByIdSchema), supplier_service_1.default.getSupplierById);
supplierRouter.put("/:id", authentication_1.authentication, (0, validation_1.validation)(supplierValidation.updateSupplierSchema), supplier_service_1.default.updateSupplier);
supplierRouter.delete("/:id", authentication_1.authentication, (0, validation_1.validation)(supplierValidation.getSupplierByIdSchema), supplier_service_1.default.deleteSupplier);
exports.default = supplierRouter;
