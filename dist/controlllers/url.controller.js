"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlController = void 0;
const url_service_1 = require("../service/url.service");
const mongodb_1 = require("mongodb");
class URLController {
    constructor(_urlService) {
        this._urlService = _urlService;
    }
    async createShortURL(req, res) {
        try {
            const { longUrl, customAlias, topic } = req.body;
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ error: "User not authenticated" });
                return;
            }
            console.log('Received request to create short URL:', { longUrl, customAlias, topic, userId });
            const url = await this._urlService.createShortURL(longUrl, customAlias, userId, topic);
            console.log('Returning response:', { url });
            res.status(201).json({ url });
        }
        catch (error) {
            console.error('Error occurred:', error);
            if (!res.headersSent) {
                res.status(500).json({
                    error: error instanceof Error ? error.message : "An unknown error occurred"
                });
            }
        }
    }
    async getAnalytics(req, res) {
        try {
            const { alias } = req.params;
            const analytics = await this._urlService.getAnalyticsByAlias(alias);
            if (!analytics) {
                return res.status(404).json({ error: "URL not found" });
            }
            return res.json(analytics);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ error: error.message });
            }
            else {
                console.error("Unknown error type:", error);
                return res.status(500).json({ error: "An unknown error occurred" });
            }
        }
    }
    async getAnalyticsByTopic(req, res) {
        try {
            const { topic } = req.params;
            const analytics = await this._urlService.getURLsByTopic(topic);
            if (!analytics) {
                return res.status(404).json({ error: "No URLs found for the specified topic" });
            }
            return res.json({
                totalClicks: analytics.totalClicks,
                uniqueUsers: analytics.uniqueUsers,
                clicksByDate: analytics.clicksByDate,
                urls: analytics.urls,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ error: error.message });
            }
            else {
                console.error("Unknown error type:", error);
                return res.status(500).json({ error: "An unknown error occurred" });
            }
        }
    }
    async redirectToLongUrl(req, res) {
        console.log("Received request to redirect to long URL");
        try {
            const { alias } = req.params;
            const userAgent = req.headers["user-agent"] || "";
            const ipAddress = req.ip;
            const longUrl = await this._urlService.redirectAndTrackAnalytics(alias, userAgent, ipAddress);
            if (!longUrl) {
                res.status(404).json({ error: "Short URL not found" });
                return;
            }
            res.redirect(longUrl);
        }
        catch (error) {
            console.error("Error occurred:", error);
            res.status(500).json({
                error: error instanceof Error ? error.message : "An unknown error occurred",
            });
        }
    }
    async getOverallAnalytics(req, res) {
        try {
            console.log("entering");
            if (!req.user) {
                return res.status(401).json({ error: "User not authenticated" });
            }
            const userId = req.user.userId;
            if (!userId) {
                return res.status(401).json({ error: "User not authenticated" });
            }
            console.log("userId", userId);
            const userIdObj = new mongodb_1.ObjectId(userId);
            const analytics = await this._urlService.getOverallAnalytics(userIdObj);
            if (!analytics) {
                return res.status(404).json({ error: "No URLs found for the specified user" });
            }
            return res.json({
                totalUrls: analytics.totalUrls,
                totalClicks: analytics.totalClicks,
                uniqueUsers: analytics.uniqueUsers,
                clicksByDate: analytics.clicksByDate,
                osType: analytics.osType,
                deviceType: analytics.deviceType,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ error: error.message });
            }
            else {
                console.error("Unknown error type:", error);
                return res.status(500).json({ error: "An unknown error occurred" });
            }
        }
    }
}
exports.urlController = new URLController(url_service_1.urlService);
