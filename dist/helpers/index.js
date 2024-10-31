"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fieldsImage = exports.calculateWithShipment = exports.mergeShipmentAtProducts = exports.productsPricesSummary = exports.productPriceSummary = void 0;
const productPriceSummary = (product) => {
    const { quantity = 1, price, promotion } = product;
    const { price_with_discount = 0, with_discount = false } = promotion || {};
    // precio total * cantidad
    const fullPrice = price * quantity;
    // precio con descuento * cantidad
    const fullPriceDiscount = with_discount
        ? (price_with_discount || 0) * quantity
        : fullPrice;
    // precio total menos precio total con despuesto
    const totalDiscounted = fullPrice - fullPriceDiscount;
    // precio total - total descontado
    const finalPrice = fullPrice - totalDiscounted;
    return { fullPrice, fullPriceDiscount, totalDiscounted, finalPrice };
};
exports.productPriceSummary = productPriceSummary;
const productsPricesSummary = (products) => {
    const pricingInfo = products.map((product) => {
        const { fullPrice, fullPriceDiscount, totalDiscounted, finalPrice } = (0, exports.productPriceSummary)(product);
        return {
            fullPrice,
            fullPriceDiscount,
            totalDiscounted,
            finalPrice,
            ...product,
        };
    });
    // precio total del producto * cantidades
    const totalFullPrice = pricingInfo.reduce((acum, product) => acum + product.fullPrice, 0);
    // precio total del producto con descuento * cantidades
    const totalFullPriceDiscount = pricingInfo.reduce((acum, product) => acum + product.fullPriceDiscount, 0);
    // precio total descontado
    const totalDiscounted = pricingInfo.reduce((acum, product) => acum + product.totalDiscounted, 0);
    // precio total menos el total de descuentos
    const total = totalFullPrice - totalDiscounted;
    return {
        totalFullPrice,
        totalFullPriceDiscount,
        totalDiscounted,
        total,
    };
};
exports.productsPricesSummary = productsPricesSummary;
const mergeShipmentAtProducts = (products, shipment) => {
    const addShipment = Object.keys(shipment).length > 0;
    return addShipment ? [...products, shipment] : products;
};
exports.mergeShipmentAtProducts = mergeShipmentAtProducts;
const calculateWithShipment = (total, shipment) => {
    const addShipment = Object.keys(shipment).length > 0;
    return addShipment ? total + (shipment === null || shipment === void 0 ? void 0 : shipment.unit_price) : total;
};
exports.calculateWithShipment = calculateWithShipment;
exports.fieldsImage = [
    "url",
    "width",
    "height",
    "alternativeText",
    "formats",
];
