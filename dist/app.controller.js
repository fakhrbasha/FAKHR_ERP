"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap = void 0;
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const connectionDB_1 = require("./DB/connectionDB");
const global_error_handling_1 = require("./common/utils/global-error-handling");
const config_service_1 = require("./config/config.service");
const redis_service_1 = __importDefault(require("./common/services/redis.service"));
const auth_controller_1 = __importDefault(require("./modules/auth/auth.controller"));
const department_controller_1 = __importDefault(require("./modules/department/department.controller"));
const employee_controller_1 = __importDefault(require("./modules/employee/employee.controller"));
const attendance_controller_1 = __importDefault(require("./modules/Attendance/attendance.controller"));
const material_controller_1 = __importDefault(require("./modules/materials/material.controller"));
const Color_controller_1 = __importDefault(require("./modules/Color/Color.controller"));
const yarnStock_controller_1 = __importDefault(require("./modules/Stock/yarnStock.controller"));
const supplier_controller_1 = __importDefault(require("./modules/supplier/supplier.controller"));
const swagger_config_1 = require("./config/swagger.config");
const PurchaseOrder_controller_1 = __importDefault(require("./modules/PurchaseOrder/PurchaseOrder.controller"));
const product_controller_1 = __importDefault(require("./modules/products/product.controller"));
const Customer_controller_1 = __importDefault(require("./modules/Customer/Customer.controller"));
const expenses_controller_1 = __importDefault(require("./modules/expenses/expenses.controller"));
const dashboard_controller_1 = __importDefault(require("./modules/dashboard/dashboard.controller"));
const Reports_controller_1 = __importDefault(require("./modules/Reports/Reports.controller"));
const notification_controller_1 = __importDefault(require("./modules/notification/notification.controller"));
const sales_controller_1 = __importDefault(require("./modules/sales/sales.controller"));
const returnSales_controller_1 = __importDefault(require("./modules/return sales/returnSales.controller"));
const accounting_controller_1 = __importDefault(require("./modules/accounting/accounting.controller"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = config_service_1.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_config_1.swaggerSpec, {
    customSiteTitle: '🌋 Volcano API Docs',
    customCss: `.swagger-ui .topbar { background-color: #1a1a2e; } .swagger-ui .topbar-wrapper img { content: none; } .swagger-ui .topbar-wrapper::after { content: '🌋 Volcano API'; color: #e94560; font-size: 1.4rem; font-weight: 700; }`,
    swaggerOptions: { persistAuthorization: true },
}));
app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swagger_config_1.swaggerSpec);
});
app.use(async (req, res, next) => {
    await (0, connectionDB_1.connectDB)();
    await redis_service_1.default.connect();
    next();
});
app.use('/auth', auth_controller_1.default);
app.use('/department', department_controller_1.default);
app.use('/attendance', attendance_controller_1.default);
app.use('/employee', employee_controller_1.default);
app.use('/material', material_controller_1.default);
app.use('/color', Color_controller_1.default);
app.use('/yarn-stock', yarnStock_controller_1.default);
app.use('/suppliers', supplier_controller_1.default);
app.use('/purchase-order', PurchaseOrder_controller_1.default);
app.use('/products', product_controller_1.default);
app.use('/customers', Customer_controller_1.default);
app.use('/expenses', expenses_controller_1.default);
app.use('/dashboard', dashboard_controller_1.default);
app.use('/reports', Reports_controller_1.default);
app.use('/notifications', notification_controller_1.default);
app.use('/sales', sales_controller_1.default);
app.use('/return-sales', returnSales_controller_1.default);
app.use('/accounting', accounting_controller_1.default);
app.get('/', (req, res) => {
    res.status(200).json({ message: "Welcome Fakhr In Your Home" });
});
app.use(global_error_handling_1.globalErrorHandler);
app.use("{/*demo}", (req, res, next) => {
    throw new global_error_handling_1.AppError(`Invalid URL ${req.originalUrl} with method ${req.method} not found`, 404);
});
const bootstrap = () => {
    app.listen(port, () => {
        console.log(`✅ Server is running on port ${port}`);
        console.log(`📄 Swagger docs  → http://localhost:${port}/api-docs`);
        console.log(`🔗 API JSON spec → http://localhost:${port}/api-docs.json`);
    });
};
exports.bootstrap = bootstrap;
exports.default = app;
