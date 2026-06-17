import { Router } from "express";
import shiftService from "./shift.service";
import { authentication } from "../../common/middleware/authentication";

const shiftRouter = Router();

shiftRouter.post(
    "/",
    authentication,
    shiftService.createShift
);

shiftRouter.get(
    "/",
    authentication,
    shiftService.getShifts
);

shiftRouter.get(
    "/:id",
    authentication,
    shiftService.getShiftById
);

shiftRouter.patch(
    "/:id",
    authentication,
    shiftService.updateShift
);

shiftRouter.delete(
    "/:id",
    authentication,
    shiftService.deleteShift
);

export default shiftRouter;