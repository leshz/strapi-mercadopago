"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *  controller
 */
const constants_1 = require("../../constants");
exports.default = ({ strapi }) => ({
    async notification(ctx) {
        var _a;
        const payload = ((_a = ctx === null || ctx === void 0 ? void 0 : ctx.request) === null || _a === void 0 ? void 0 : _a.body) || {};
        const { config } = ctx.state;
        const { type = "", action = "" } = payload;
        strapi.log.info("Notification activated!");
        switch (type) {
            case constants_1.NOTIFICATION_TYPES.PAYMENT:
                strapi.log.info("Payment Action");
                await strapi
                    .service("plugin::strapi-ecommerce-mercadopago.mercadopago")
                    .paymentHook(payload, config);
                return ctx.send();
            default:
                strapi.log.info(`Meli Webhook type: ${type}`);
                strapi.log.info(`Meli Webhook action: ${action}`);
                return ctx.send();
        }
    },
});
