import { EventEmitter } from "node:events";
import { EmailEnum } from "../../enums/user.enum";
import { sendEmail } from "./nodeMailer";
import { WAREHOUSE_EMAIL } from "../../../config/config.service";
import { IColor } from "../../../DB/models/color.model";
import { IMaterial } from "../../../DB/models/materials.model";

export const eventEmitter = new EventEmitter();

/**
 * Confirm Email Event
 */
eventEmitter.on(EmailEnum.confirmedEmail, async (fn: () => Promise<void>) => {
    await fn();
});

/**
 * Low Stock Event
 */
eventEmitter.on(
    EmailEnum.lowStock,
    async ({
        stock,
        material,
        color,
        newQuantity,
    }: {
        stock: any;
        material: IMaterial;
        color: IColor;
        newQuantity: number;
    }) => {
        await sendEmail({
            to: WAREHOUSE_EMAIL!,
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
    }
);