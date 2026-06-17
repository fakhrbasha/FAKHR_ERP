import BaseRepository from "./base.repository";
import shiftModel, { IShift } from "../models/shift.model";

class ShiftRepository extends BaseRepository<IShift> {
    constructor() {
        super(shiftModel);
    }
}

export default ShiftRepository;