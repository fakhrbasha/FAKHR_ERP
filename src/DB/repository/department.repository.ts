import { Model } from "mongoose";
import BaseRepository from "./base.repository";
import departmentModel, { IDepartment } from "../models/department.model";


class DepartmentRepository extends BaseRepository<IDepartment> {
    constructor(protected readonly model: Model<IDepartment> = departmentModel) {
        super(model)
    }
}

export default DepartmentRepository