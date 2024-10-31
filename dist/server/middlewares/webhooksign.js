"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySign = void 0;
const crypto_1 = __importDefault(require("crypto"));
const verifySign = (option, { strapi }) => {
    return async (ctx, next) => {
        var _a;
        try {
            strapi.log.info("VERIFY SIGN");
            const FF = ((_a = process.env.FF_VERIFICATION_SIGN) !== null && _a !== void 0 ? _a : "true") === "true";
            if (!FF) {
                strapi.log.warn("⚠️ FF_VERIFICATION_SIGN: DEACTIVATED");
                return next();
            }
            const queryParams = ctx.request.query || {};
            const xSignature = ctx.request.headers["x-signature"] || "";
            const xRequestId = ctx.request.headers["x-request-id"] || "";
            const dataID = (queryParams === null || queryParams === void 0 ? void 0 : queryParams["data.id"]) || "";
            const { config: { webhook_pass }, } = ctx.state;
            let ts = "";
            let hash = "";
            if (xSignature) {
                const parts = xSignature.split(",");
                parts.forEach((part) => {
                    const [key, value] = part.split("=");
                    if (key && value) {
                        const trimmedKey = key.trim();
                        const trimmedValue = value.trim();
                        if (trimmedKey === "ts") {
                            ts = trimmedValue;
                        }
                        else if (trimmedKey === "v1") {
                            hash = trimmedValue;
                        }
                    }
                });
            }
            console.debug({ ts, hash, dataID, xRequestId, webhook_pass });
            if (ts && hash && dataID && xRequestId) {
                const secret = webhook_pass;
                const manifest = `id:${dataID};request-id:${xRequestId};ts:${ts};`;
                const hmac = crypto_1.default.createHmac("sha256", secret);
                hmac.update(manifest);
                const sha = hmac.digest("hex");
                console.log(sha);
                console.log(hash);
                if (sha === hash) {
                    strapi.log.info("Webhook Auth Success");
                    return next();
                }
                else {
                    strapi.log.info("Webhook Auth Failed");
                    return ctx.serviceUnavailable("Service Unavailable");
                }
            }
            else {
                strapi.log.warn("Missing required values:");
                if (!ts)
                    strapi.log.warn("ts is missing");
                if (!hash)
                    strapi.log.warn("hash is missing");
                if (!dataID)
                    strapi.log.warn("dataID is missing");
                if (!xRequestId)
                    strapi.log.warn("xRequestId is missing");
                return ctx.internalServerError();
            }
        }
        catch (error) {
            strapi.log.error("Error Sign Auth Middleware");
            strapi.log.error(error);
            return ctx.serviceUnavailable("Service Unavailable");
        }
    };
};
exports.verifySign = verifySign;
