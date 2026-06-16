import { Model } from "mongoose";
import companyModel, { ICompany } from "../models/company.model";
import BaseRepository from "./base.repository";

class CompanyRepository extends BaseRepository<ICompany> {
    constructor(protected readonly model: Model<ICompany> = companyModel) {
        super(model);
    }
}

export default CompanyRepository;
