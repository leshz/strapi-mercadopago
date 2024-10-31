"use strict";
/**
 *  service
 */
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
const constants_1 = require("../../constants");
const utils_1 = require("@strapi/utils");
const helpers_1 = require("../../helpers");
exports.default = strapi_1.factories.createCoreService("plugin::strapi-ecommerce-mercadopago.invoice", ({ strapi }) => ({
    async createInitialInvoice({ shipping, products, shopper, shipment, config, }) {
        var _a;
        try {
            const formatedProducts = await strapi
                .service("plugin::strapi-ecommerce-mercadopago.mercadopago")
                .meliProduct(products, config);
            const productsWithShipment = (0, helpers_1.mergeShipmentAtProducts)(formatedProducts, shipment);
            const { total: subtotal, totalDiscounted } = (0, helpers_1.productsPricesSummary)(products);
            const total = (0, helpers_1.calculateWithShipment)(subtotal, shipment);
            const savedata = await ((_a = strapi === null || strapi === void 0 ? void 0 : strapi.entityService) === null || _a === void 0 ? void 0 : _a.create("plugin::strapi-ecommerce-mercadopago.invoice", {
                data: {
                    payment_status: constants_1.INVOICES_STATUS.INITIAL,
                    total: total,
                    total_discount: totalDiscounted,
                    products: productsWithShipment,
                    payment_link: "",
                    shipping_status: constants_1.SHIPPING_STATUS.INITIAL,
                    shopper: { ...shopper, last_name: shopper.lastName },
                    shipping: { ...shipping, postal_code: shipping.postalCode || 0 },
                },
            }));
            return savedata;
        }
        catch (error) {
            console.log(JSON.stringify(error, null, 2));
            throw new utils_1.errors.ApplicationError(error.message, {
                service: "createInitialInvoice",
            });
        }
    },
    updateInvoice: async ({ id, data }) => {
        var _a;
        try {
            const savedata = await ((_a = strapi.entityService) === null || _a === void 0 ? void 0 : _a.update("plugin::strapi-ecommerce-mercadopago.invoice", id, { data }));
            return savedata;
        }
        catch (error) {
            throw new utils_1.errors.ApplicationError(error.message, {
                service: "updateInvoice",
            });
        }
    },
}));
