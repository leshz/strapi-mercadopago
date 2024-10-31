"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const category_1 = __importDefault(require("./category"));
const product_1 = __importDefault(require("./product"));
const configuration_1 = __importDefault(require("./configuration"));
const invoice_1 = __importDefault(require("./invoice"));
const mercadopago_1 = __importDefault(require("./mercadopago"));
const shipment_1 = __importDefault(require("./shipment"));
exports.default = {
    category: category_1.default,
    product: product_1.default,
    configuration: configuration_1.default,
    invoice: invoice_1.default,
    mercadopago: mercadopago_1.default,
    shipment: shipment_1.default,
};
