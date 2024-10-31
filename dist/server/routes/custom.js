"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: "GET",
            path: "/products/:slug",
            handler: "product.findOne",
        },
        {
            method: "GET",
            path: "/products",
            handler: "product.find",
        },
    ],
};
