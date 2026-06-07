import { Router } from "express";
import { authentication } from "../../common/middleware/authentication";
import PurchaseOrderService from "./PurchaseOrder.service";
import { validation } from "../../common/middleware/validation";
import * as purchaserValidation from "./PurchaseOrder.validation";
const purchaseOrderRouter = Router()
purchaseOrderRouter.post('/create-order', authentication,
    validation(purchaserValidation.createPurchaseOrderSchema),
    PurchaseOrderService.createPurchaseOrder)


purchaseOrderRouter.get('/', authentication,
    PurchaseOrderService.getAllPurchaseOrders)

purchaseOrderRouter.get('/:id', authentication,
    validation(purchaserValidation.approveOrderSchema),
    PurchaseOrderService.getOrderById)
purchaseOrderRouter.patch('/:id/approve', authentication,
    validation(purchaserValidation.approveOrderSchema),
    PurchaseOrderService.approveOrder)
purchaseOrderRouter.patch('/:id/cancel', authentication,
    validation(purchaserValidation.approveOrderSchema),
    PurchaseOrderService.cancelOrder
)
purchaseOrderRouter.patch('/:id/receive', authentication,
    validation(purchaserValidation.approveOrderSchema),
    PurchaseOrderService.receiveOrder
)


export default purchaseOrderRouter