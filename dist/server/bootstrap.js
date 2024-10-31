"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shipping_json_1 = __importDefault(require("../components/mercadopago/shipping.json"));
const shopper_json_1 = __importDefault(require("../components/mercadopago/shopper.json"));
exports.default = async ({ strapi }) => {
    const shippingComponent = strapi.components["mercadopago.shipping"];
    const shopperComponent = strapi.components["mercadopago.shopper"];
    if (!shopperComponent && !shippingComponent) {
        strapi.log.info("Register new components");
        const res = await strapi
            .plugin("content-type-builder")
            .services.components.createComponent({
            component: {
                category: "mercadopago",
                displayName: shipping_json_1.default.info.displayName,
                icon: shipping_json_1.default.info.icon,
                attributes: shipping_json_1.default.attributes,
            },
            components: [
                {
                    tmpUID: "mercadopago.shopper",
                    category: "mercadopago",
                    displayName: shopper_json_1.default.info.displayName,
                    icon: shopper_json_1.default.info.icon,
                    attributes: shopper_json_1.default.attributes,
                },
            ],
        });
    }
};
