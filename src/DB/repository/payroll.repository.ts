import { Model } from "mongoose";
import BaseRepository from "./base.repository";
import EmployeePaymentModel, { IEmployeePayment } from "../models/payroll.model";


class EmployeePaymentRepository extends BaseRepository<IEmployeePayment> {
    constructor(protected readonly model: Model<IEmployeePayment> = EmployeePaymentModel) {
        super(model)
    }
}

export default EmployeePaymentRepository