"use strict";
/**
 *  controller
 */
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../constants");
exports.default = ({ strapi }) => ({
    async checkout(ctx, next) {
        const { config } = ctx.state;
        //TODO : Add validation
        const { items, buyer, ship } = ctx.request.body || {};
        if (items.length === 0)
            return ctx.badRequest();
        try {
            const products = await strapi
                .service("plugin::strapi-ecommerce-mercadopago.mercadopago")
                .products(items, config);
            const buyerData = await strapi
                .service("plugin::strapi-ecommerce-mercadopago.mercadopago")
                .buyer(buyer, ship);
            const shipment = await strapi
                .service("plugin::strapi-ecommerce-mercadopago.mercadopago")
                .shipment(ship, products);
            const initInvoice = await strapi
                .service("plugin::strapi-ecommerce-mercadopago.invoice")
                .createInitialInvoice({
                shipping: ship,
                shopper: buyer,
                products,
                shipment,
                config,
            });
            if (!initInvoice) {
                ctx.internalServerError("Creating invoice Error", {
                    controller: "createInvoice",
                });
            }
            const preference = await strapi
                .service("plugin::strapi-ecommerce-mercadopago.mercadopago")
                .createPreference({
                products,
                payer: buyerData,
                shipment,
                internalInvoiceId: initInvoice.id,
            }, config);
            const { id, init_point, collector_id } = preference;
            const updatedInvoice = await strapi
                .service("plugin::strapi-ecommerce-mercadopago.invoice")
                .updateInvoice({
                id: initInvoice.id,
                data: {
                    ...initInvoice,
                    payment_status: constants_1.INVOICES_STATUS.IN_PROCESS,
                    collector_id: `${collector_id}`,
                    preference_id: id,
                    payment_link: init_point,
                },
            });
            return ctx.send({
                init_point,
                preferenceId: id,
                collector_id,
                invoiceId: updatedInvoice.id,
            });
        }
        catch (error) {
            strapi.log.error(error);
            return ctx.internalServerError({ error });
        }
    },
});
