"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const url_controller_1 = require("../controlllers/url.controller");
const authenticatUser_1 = __importDefault(require("../middleware/authenticatUser"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const createUrlRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: 5,
    keyGenerator: (req) => req.body.userId,
    message: "Too many URLs created, please try again after an hour.",
    standardHeaders: true,
    legacyHeaders: false,
});
const urlRouter = (0, express_1.Router)();
urlRouter.post('/shorten', createUrlRateLimiter, authenticatUser_1.default, url_controller_1.urlController.createShortURL.bind(url_controller_1.urlController));
urlRouter.get("/shorten/:alias", url_controller_1.urlController.redirectToLongUrl.bind(url_controller_1.urlController));
urlRouter.get("/analytics/topic/:topic", authenticatUser_1.default, url_controller_1.urlController.getAnalyticsByTopic.bind(url_controller_1.urlController));
urlRouter.get("/analytics/overall", authenticatUser_1.default, url_controller_1.urlController.getOverallAnalytics.bind(url_controller_1.urlController));
urlRouter.get("/analytics/:alias", authenticatUser_1.default, url_controller_1.urlController.getAnalytics.bind(url_controller_1.urlController));
exports.default = urlRouter;
