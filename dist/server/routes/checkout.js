"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../constants");
exports.default = {
    type: "content-api",
    routes: [
        {
            method: constants_1.METHODS.POST,
            path: constants_1.URLS.CHECKOUT,
            handler: "checkout.checkout",
            config: {
                middlewares: ["plugin::strapi-ecommerce-mercadopago.loadConfig"],
            },
        },
    ],
};
