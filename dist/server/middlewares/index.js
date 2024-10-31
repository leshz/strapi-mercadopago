"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configuration_1 = require("./configuration");
const webhooksign_1 = require("./webhooksign");
const product_1 = require("./product");
exports.default = { loadConfig: configuration_1.loadConfig, verifySign: webhooksign_1.verifySign, populating: product_1.populating };
