"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.populating = void 0;
const helpers_1 = require("../../helpers");
const populating = (config, { strapi }) => {
    return async (ctx, next) => {
        ctx.query.populate = {
            pictures: {
                fields: helpers_1.fieldsImage,
            },
            categories: {
                fields: ["name", "slug"],
            },
            promotion: {
                fields: ["*"],
            },
            ...ctx.query.populate,
        };
        return next();
    };
};
exports.populating = populating;
