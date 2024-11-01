"use strict";
/**
 *  router
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    type: "content-api",
    routes: [
        {
            method: "GET",
            path: "/products/:slug",
            handler: "product.findOne",
            config: {
                middlewares: ["plugin::strapi-ecommerce-mercadopago.populating"],
            },
        },
        {
            method: "GET",
            path: "/products",
            handler: "product.find",
            config: {
                middlewares: ["plugin::strapi-ecommerce-mercadopago.populating"],
            },
        },
    ],
};
