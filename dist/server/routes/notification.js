"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../constants");
exports.default = {
    type: "content-api",
    routes: [
        {
            method: constants_1.METHODS.POST,
            path: constants_1.URLS.WEBHOOK,
            handler: "notification.notification",
            config: {
                middlewares: [
                    "plugin::strapi-ecommerce-mercadopago.loadConfig",
                    "plugin::strapi-ecommerce-mercadopago.verifySign",
                ],
                auth: false,
            },
        },
    ],
};
