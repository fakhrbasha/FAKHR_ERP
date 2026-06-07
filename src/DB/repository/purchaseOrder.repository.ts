import { Model } from "mongoose";
import BaseRepository from "./base.repository";
import attendanceModel, { IAttendance } from "../models/attendance.model";
import purchaseOrderModel, { IPurchaseOrder } from "../models/purchaseOrder.model";


class purchaseOrderRepository extends BaseRepository<IPurchaseOrder> {
    constructor(protected readonly model: Model<IPurchaseOrder> = purchaseOrderModel) {
        super(model)
    }
}

export default purchaseOrderRepository