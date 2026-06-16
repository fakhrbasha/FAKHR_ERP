"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const company_model_1 = __importDefault(require("../models/company.model"));
const base_repository_1 = __importDefault(require("./base.repository"));
class CompanyRepository extends base_repository_1.default {
    model;
    constructor(model = company_model_1.default) {
        super(model);
        this.model = model;
    }
}
exports.default = CompanyRepository;
