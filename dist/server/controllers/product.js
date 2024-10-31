"use strict";
/**
 *  controller
 */
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
const utils_1 = require("@strapi/utils");
exports.default = strapi_1.factories.createCoreController("plugin::strapi-ecommerce-mercadopago.product", ({ strapi }) => ({
    async findOne(ctx) {
        await this.validateQuery(ctx);
        const { slug } = ctx.params;
        if (!strapi.db)
            throw new utils_1.errors.ApplicationError("Service not Available");
        const entity = await strapi.db
            .query("plugin::strapi-ecommerce-mercadopago.product")
            .findOne({
            where: { slug },
            populate: true,
        });
        if (entity === null)
            return ctx.notFound();
        const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
        return ctx.send(this.transformResponse(sanitizedEntity));
    },
}));
