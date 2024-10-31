"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INVOICES_MEANING = exports.ACTIONS_TYPES = exports.NOTIFICATION_TYPES = exports.METHODS = exports.URLS = exports.SHIPPING_STATUS = exports.INVOICES_STATUS = void 0;
exports.INVOICES_STATUS = {
    PENDING: "pending",
    APPROVED: "approved",
    AUTHORIZED: "authorized",
    IN_PROCESS: "in_process",
    IN_MEDIATION: "in_mediation",
    REJECTED: "rejected",
    CANCELLED: "cancelled",
    REFUNDED: "refunded",
    CHARGED_BACK: "charged_back",
    INITIAL: "initial",
};
exports.SHIPPING_STATUS = {
    INITIAL: "initial",
    IN_PROCESS: "in_process",
    ON_DELIVERY: "on_delivery",
    DELIVERED: "delivered",
    CANCELLED: "cancelled",
    REFUNDED: "refunded",
};
exports.URLS = {
    CHECK: "/",
    CHECKOUT: "/checkout",
    WEBHOOK: "/notifications",
};
exports.METHODS = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
};
exports.NOTIFICATION_TYPES = {
    PAYMENT: "payment",
};
exports.ACTIONS_TYPES = {
    CREATE: "payment.created",
    UPDATE: "payment.updated",
};
// data from https://www.mercadopago.com.co/developers/en/reference/payments/_payments_id/get
exports.INVOICES_MEANING = {
    pending: "El usuario no ha concluido el proceso de pago",
    approved: "El pago ha sido aprobado y acreditado.",
    authorized: "El pago ha sido autorizado pero aún no capturado.",
    in_process: "El pago está en análisis.",
    in_mediation: "El usuario inició una disputa.",
    rejected: "El pago fue rechazado (el usuario puede intentar pagar de nuevo).",
    cancelled: "El pago fue cancelado por una de las partes o expiró.",
    refunded: "El pago fue devuelto al usuario.",
    charged_back: "Se realizó un contracargo en la tarjeta de crédito del comprador.",
};
