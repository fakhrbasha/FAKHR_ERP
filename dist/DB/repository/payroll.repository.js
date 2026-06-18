"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_repository_1 = __importDefault(require("./base.repository"));
const payroll_model_1 = __importDefault(require("../models/payroll.model"));
class EmployeePaymentRepository extends base_repository_1.default {
    model;
    constructor(model = payroll_model_1.default) {
        super(model);
        this.model = model;
    }
}
exports.default = EmployeePaymentRepository;
