"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventEmitter = void 0;
const node_events_1 = require("node:events");
const user_enum_1 = require("../../enums/user.enum");
const nodeMailer_1 = require("./nodeMailer");
const config_service_1 = require("../../../config/config.service");
exports.eventEmitter = new node_events_1.EventEmitter();
exports.eventEmitter.on(user_enum_1.EmailEnum.confirmedEmail, async (fn) => {
    await fn();
});
exports.eventEmitter.on(user_enum_1.EmailEnum.lowStock, async ({ stock, material, color, newQuantity, }) => {
    await (0, nodeMailer_1.sendEmail)({
        to: config_service_1.WAREHOUSE_EMAIL,
        subject: "Low Stock Alert",
        html: `
                <h2>Low Stock Alert</h2>
                <p>Material: ${material.name}</p>
                <p>Color: ${color.name}</p>
                <p>Current Quantity: ${newQuantity}</p>
                <p>Minimum Quantity: ${stock.minQuantity}</p>
                <p>Please restock this item as soon as possible.</p>
            `,
    });
});
