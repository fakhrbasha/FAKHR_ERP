"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_repository_1 = __importDefault(require("./base.repository"));
const sales_model_1 = require("../models/sales.model");
class SalesRepository extends base_repository_1.default {
    model;
    constructor(model = sales_model_1.SalesModel) {
        super(model);
        this.model = model;
    }
}
exports.default = SalesRepository;
