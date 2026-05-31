import { Model } from "mongoose";
import employeeModel, { IEmployee } from "../models/employee.model";
import BaseRepository from "./base.repository";


class EmployeeRepository extends BaseRepository<IEmployee> {
    constructor(protected readonly model: Model<IEmployee> = employeeModel) {
        super(model)
    }
}

export default EmployeeRepository