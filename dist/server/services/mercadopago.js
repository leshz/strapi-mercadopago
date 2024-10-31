"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin_purchase_1 = require("../../templates/admin-purchase");
const utils_1 = require("@strapi/utils");
const mercadopago_1 = require("mercadopago");
const constants_1 = require("../../constants");
const helpers_1 = require("../../helpers");
const productFormatter = (products, config) => {
    const { default_currency } = config;
    return products.map((product) => {
        var _a, _b;
        const { pictures, promotion, categories, price } = product;
        const categoryId = ((_a = categories === null || categories === void 0 ? void 0 : categories[0]) === null || _a === void 0 ? void 0 : _a.id) || 0;
        const { with_discount = false, price_with_discount = 0 } = promotion || {};
        const finalPriceProduct = with_discount ? price_with_discount : price;
        const urlImage = ((_b = pictures === null || pictures === void 0 ? void 0 : pictures[0]) === null || _b === void 0 ? void 0 : _b.url) || "";
        return {
            id: product.sku,
            title: product.name,
            description: product.short_description,
            picture_url: urlImage,
            quantity: product.quantity,
            currency_id: default_currency,
            unit_price: finalPriceProduct,
            category_id: categoryId,
        };
    });
};
exports.default = ({ strapi }) => ({
    meliProduct: (product, config) => {
        return productFormatter(product, config);
    },
    products: async (items) => {
        const attibutes = [
            "id",
            "name",
            "price",
            "short_description",
            "slug",
            "stock",
            "type",
            "sku",
        ];
        if (!strapi.db)
            throw new utils_1.errors.ApplicationError("Service not Available");
        const sku = items.map(({ sku = "" }) => ({ sku }));
        const results = await strapi.db
            .query("plugin::strapi-ecommerce-mercadopago.product")
            .findMany({
            select: attibutes,
            where: { $or: sku },
            populate: ["pictures", "promotion", "categories"],
        });
        if (results.length === 0)
            throw new utils_1.errors.ApplicationError("products are not availables");
        return results.map((product) => {
            const productSelected = items.find(({ sku }) => sku === product.sku);
            if ((productSelected === null || productSelected === void 0 ? void 0 : productSelected.quantity) > product.stock) {
                throw new utils_1.errors.ApplicationError("stock no available", {
                    product: product.sku,
                    stock: product.stock,
                });
            }
            return {
                ...product,
                stock: null,
                quantity: productSelected === null || productSelected === void 0 ? void 0 : productSelected.quantity,
            };
        });
    },
    buyer: async (buyer, ship) => {
        const { dni, email, lastName, name, phone } = buyer;
        const { postalCode = "", address, city, department } = ship;
        const payer = {
            name,
            surname: lastName,
            email,
            phone: {
                area_code: "57",
                number: phone,
            },
            identification: {
                type: "CC",
                number: dni,
            },
            address: {
                zip_code: postalCode,
                street_name: `${department} ${city}`,
                street_number: `${address}`,
            },
        };
        return payer;
    },
    shipment: async (shipping, products) => {
        const { type: shippingType = "SW01" } = shipping;
        const includeShipment = products.some(({ type }) => {
            return type === "producto" /* TYPE_OF_PRODUCTS.PRODUCT */;
        });
        if (includeShipment) {
            const shipment = await strapi
                .query("plugin::strapi-ecommerce-mercadopago.shipment")
                .findOne({
                select: ["*"],
                where: { code: shippingType },
            });
            if (!shipment) {
                return {};
            }
            return {
                id: shipment.code,
                title: "Cargo de envio",
                description: "Cargo de envio",
                quantity: 1,
                unit_price: shipment.price,
                currency_id: "COP",
            };
        }
        return {};
    },
    createPreference: async ({ products, payer, internalInvoiceId, shipment }, config) => {
        const { token, back_urls, bussiness_description, notification_url } = config;
        const productsFormmated = productFormatter(products, config);
        const items = (0, helpers_1.mergeShipmentAtProducts)(productsFormmated, shipment);
        const client = new mercadopago_1.MercadoPagoConfig({
            accessToken: token,
            options: { timeout: 5000, idempotencyKey: "abc" },
        });
        const preference = new mercadopago_1.Preference(client);
        const payment_methods = { installments: 24, default_installments: 1 };
        const metadata = {};
        const body = {
            back_urls: {
                failure: back_urls,
                pending: back_urls,
                success: back_urls,
            },
            binary_mode: true,
            external_reference: internalInvoiceId,
            items,
            metadata,
            notification_url,
            payer,
            payment_methods,
            statement_descriptor: bussiness_description,
        };
        try {
            const response = await preference.create({ body });
            return response;
        }
        catch (error) {
            throw new utils_1.errors.ApplicationError(error.message, {
                service: "createPreference",
            });
        }
    },
    paymentHook: async (payload, config) => {
        const { token = "", send_emails, email } = config;
        const { data: { id = "" }, } = payload;
        if (Number(id) === 123456) {
            return;
        }
        const client = new mercadopago_1.MercadoPagoConfig({
            accessToken: token,
            options: { timeout: 5000, idempotencyKey: "abc" },
        });
        if (id === "") {
            throw new utils_1.errors.ApplicationError("no ID", {
                service: "paymentAction",
            });
        }
        const paymentService = new mercadopago_1.Payment(client);
        const response = await paymentService.get({ id });
        const { status, additional_info, external_reference: invoiceId, payment_type_id = "", } = response;
        const { items = [], ip_address } = additional_info || {};
        const invoice = await strapi
            .query("plugin::strapi-ecommerce-mercadopago.invoice")
            .findOne({
            select: ["*"],
            where: { id: invoiceId },
        });
        if (invoice === null) {
            strapi.log.info(`Invoice: not found`);
            return;
        }
        if (invoice.status === constants_1.INVOICES_STATUS.APPROVED) {
            strapi.log.info(`Invoice: On retry but it has status approved`);
            return;
        }
        // PAYMENT SUCCESSFULL
        if (status === constants_1.INVOICES_STATUS.APPROVED) {
            // UPDATE STATUS FROM PAYMENT SERVICE
            strapi.log.info(`TO THE MOON 🚀`);
            await strapi
                .query("plugin::strapi-ecommerce-mercadopago.invoice")
                .update({
                where: { id: invoiceId },
                data: {
                    payment_status: status,
                    paid_with: payment_type_id,
                },
            });
            strapi.log.info(`Invoice: ${invoiceId} has been updated with Status: ${status}`);
            await items.forEach(async (product) => {
                const dbproduct = await strapi
                    .query("plugin::strapi-ecommerce-mercadopago.product")
                    .findOne({ where: { sku: product.id } });
                if (dbproduct) {
                    const newStock = Number(dbproduct.stock) - Number(product.quantity);
                    await strapi
                        .query("plugin::strapi-ecommerce-mercadopago.product")
                        .update({
                        where: { sku: product.id },
                        data: {
                            stock: newStock,
                        },
                    });
                    strapi.log.info(`Product: ${dbproduct.sku} has been updated with Stock: ${newStock}`);
                }
                else {
                    strapi.log.info(`Product without update: ${product.id}`);
                }
            });
            // TODO : move to service
            if (send_emails) {
                await strapi.plugins["email"].services.email.send({
                    to: email,
                    from: "admin@sagradacura.com",
                    subject: "Nuevo pedido recibido :)",
                    html: admin_purchase_1.purchase,
                });
            }
        }
        else {
            await strapi
                .query("plugin::strapi-ecommerce-mercadopago.invoice")
                .update({
                where: { id: invoiceId },
                data: {
                    status,
                    paid_with: payment_type_id,
                },
            });
            strapi.log.info(`Invoice: ${invoiceId} has been updated with Status: ${status}`);
        }
    },
});
