"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlRepository = void 0;
const url_1 = require("../models/url");
class URLRepository {
    async createURL(urlData) {
        try {
            const createdUrl = await url_1.URLModel.create(urlData);
            console.log('URL created in database:', createdUrl);
            return createdUrl;
        }
        catch (error) {
            console.error('Error in URL creation in repository:', error);
            throw new Error('Failed to save URL');
        }
    }
    async findURLByAlias(alias) {
        return url_1.URLModel.findOne({ customAlias: alias });
    }
    async updateAnalytics(alias, analyticsUpdate) {
        await url_1.URLModel.updateOne({ customAlias: alias }, { $set: { analytics: analyticsUpdate } });
    }
    async getURLsByTopic(topic) {
        return url_1.URLModel.aggregate([
            { $match: { topic } }, // Match URLs based on the topic
            {
                $group: {
                    _id: null, // Group by topic (only one group for the entire topic)
                    totalClicks: { $sum: "$analytics.totalClicks" },
                    uniqueUsers: { $addToSet: { $concatArrays: ["$analytics.uniqueUsers"] } },
                    clicksByDate: { $push: { date: "$createdAt", clicks: "$analytics.totalClicks" } },
                    urls: {
                        $push: {
                            shortUrl: "$shortUrl",
                            totalClicks: "$analytics.totalClicks",
                            uniqueUsers: { $size: "$analytics.uniqueUsers" },
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalClicks: 1,
                    uniqueUsers: { $size: { $reduce: { input: "$uniqueUsers", initialValue: [], in: { $setUnion: ["$$value", "$$this"] } } } },
                    clicksByDate: 1,
                    urls: 1,
                },
            },
        ]);
    }
    async getOverallAnalytics(userId) {
        const result = await url_1.URLModel.aggregate([
            { $match: { userId } },
            {
                $group: {
                    _id: null,
                    totalUrls: { $sum: 1 },
                    totalClicks: { $sum: "$analytics.totalClicks" },
                    uniqueUsers: {
                        $addToSet: "$analytics.uniqueUsers" // Changed this line
                    },
                    clicksByDate: { $push: { date: "$createdAt", clicks: "$analytics.totalClicks" } },
                    osType: { $push: "$analytics.osType" },
                    deviceType: { $push: "$analytics.deviceType" },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalUrls: 1,
                    totalClicks: 1,
                    uniqueUsers: {
                        $size: {
                            $reduce: {
                                input: { $ifNull: ["$uniqueUsers", []] }, // Removed arrayElemAt
                                initialValue: [],
                                in: {
                                    $setUnion: ["$$value", { $ifNull: ["$$this", []] }] // Added ifNull check
                                },
                            },
                        },
                    },
                    clicksByDate: 1,
                    osType: {
                        $map: {
                            input: { $ifNull: ["$osType", []] }, // Added ifNull check
                            as: "os",
                            in: {
                                osName: { $arrayElemAt: [{ $ifNull: ["$$os.osName", []] }, 0] },
                                uniqueClicks: { $sum: { $ifNull: ["$$os.uniqueClicks", 0] } },
                                uniqueUsers: { $size: { $setUnion: [{ $ifNull: ["$$os.uniqueUsers", []] }, []] } },
                            },
                        },
                    },
                    deviceType: {
                        $map: {
                            input: { $ifNull: ["$deviceType", []] }, // Added ifNull check
                            as: "device",
                            in: {
                                deviceName: { $arrayElemAt: [{ $ifNull: ["$$device.deviceName", []] }, 0] },
                                uniqueClicks: { $sum: { $ifNull: ["$$device.uniqueClicks", 0] } },
                                uniqueUsers: { $size: { $setUnion: [{ $ifNull: ["$$device.uniqueUsers", []] }, []] } },
                            },
                        },
                    },
                },
            },
        ]);
        return result.length > 0 ? result[0] : null;
    }
    async getUserURLs(userId) {
        return url_1.URLModel.find({ userId });
    }
}
exports.urlRepository = new URLRepository();
