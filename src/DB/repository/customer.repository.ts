import { Model } from "mongoose";
import BaseRepository from "./base.repository";
import customerModel, { ICustomer } from "../models/customer.model";


class CustomerRepository extends BaseRepository<ICustomer> {
    constructor(protected readonly model: Model<ICustomer> = customerModel) {
        super(model)
    }
}

export default CustomerRepository