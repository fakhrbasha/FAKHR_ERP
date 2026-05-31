"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const employee_repository_1 = __importDefault(require("../../DB/repository/employee.repository"));
class EmployeeService {
    _employeeMode = new employee_repository_1.default();
    createEmployee = (req, res, next) => {
        const { fullName, salary, phone, role } = req.body;
        const { departmentId } = req.params;
    };
}
exports.default = new EmployeeService();
