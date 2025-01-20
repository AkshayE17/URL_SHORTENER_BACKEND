"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlService = void 0;
const url_repository_1 = require("../repository/url.repository");
const mongoose_1 = require("mongoose");
class URLService {
    constructor(_urlRepository) {
        this._urlRepository = _urlRepository;
    }
    async createShortURL(longUrl, customAlias, userId, topic) {
        try {
            const alias = customAlias || this.generateAlias();
            const shortUrl = `${process.env.baseUrl}/shorten/${alias}`;
            const userIdObject = new mongoose_1.Types.ObjectId(userId);
            console.log('Creating short URL:', { longUrl, customAlias, userId, topic });
            const url = await this._urlRepository.createURL({
                longUrl,
                shortUrl,
                customAlias,
                userId: userIdObject,
                topic,
                analytics: {
                    totalClicks: 0,
                    uniqueUsers: [],
                    clicksByDate: new Map(),
                    osType: [],
                    deviceType: []
                }
            });
            if (!url) {
                throw new Error('Failed to create URL');
            }
            console.log('Short URL created:', url);
            return url;
        }
        catch (error) {
            console.error('Error creating short URL:', error);
            throw error;
        }
    }
    async getAnalyticsByAlias(alias) {
        const url = await this._urlRepository.findURLByAlias(alias);
        if (!url) {
            return null;
        }
        const analytics = url.analytics;
        return {
            totalClicks: analytics.totalClicks,
            uniqueUsers: analytics.uniqueUsers.length,
            clicksByDate: Object.fromEntries(analytics.clicksByDate),
            osType: analytics.osType.map((os) => ({
                osName: os.osName,
                uniqueClicks: os.uniqueClicks,
                uniqueUsers: os.uniqueUsers.length,
            })),
            deviceType: analytics.deviceType.map((device) => ({
                deviceName: device.deviceName,
                uniqueClicks: device.uniqueClicks,
                uniqueUsers: device.uniqueUsers.length,
            })),
        };
    }
    async getURLsByTopic(topic) {
        const result = await this._urlRepository.getURLsByTopic(topic);
        if (result.length === 0)
            return null;
        return result[0];
    }
    async getOverallAnalytics(userId) {
        const result = await this._urlRepository.getOverallAnalytics(userId);
        if (!result)
            return null;
        return result;
    }
    // 生成一个随机字符串作为别名
    generateAlias() {
        return Math.random().toString(36).substring(2, 8);
    }
    async redirectAndTrackAnalytics(alias, userAgent, ipAddress) {
        console.log(`Attempting to find URL for alias: ${alias}`);
        const url = await this._urlRepository.findURLByAlias(alias);
        if (!url) {
            console.log(`URL not found for alias: ${alias}`);
            return null;
        }
        console.log(`URL found for alias: ${alias}, updating analytics...`);
        const analytics = url.analytics;
        analytics.totalClicks += 1;
        console.log(`Total Clicks: ${analytics.totalClicks}`);
        // Track unique users
        if (!analytics.uniqueUsers.includes(ipAddress)) {
            console.log(`New unique user detected: ${ipAddress}`);
            analytics.uniqueUsers.push(ipAddress);
        }
        else {
            console.log(`User already exists: ${ipAddress}`);
        }
        // Track clicks by date
        const today = new Date().toISOString().split("T")[0];
        if (!analytics.clicksByDate.has(today)) {
            console.log(`No clicks recorded for today (${today}), initializing...`);
            analytics.clicksByDate.set(today, 0);
        }
        analytics.clicksByDate.set(today, analytics.clicksByDate.get(today) + 1);
        console.log(`Clicks for today (${today}): ${analytics.clicksByDate.get(today)}`);
        // Track Operating System (OS)
        const osName = this.getOSFromUserAgent(userAgent);
        console.log(`Detected OS: ${osName}`);
        const os = analytics.osType.find((o) => o.osName === osName);
        if (os) {
            os.uniqueClicks += 1;
            if (!os.uniqueUsers.includes(ipAddress)) {
                console.log(`New unique user for OS (${osName}): ${ipAddress}`);
                os.uniqueUsers.push(ipAddress);
            }
        }
        else {
            console.log(`OS (${osName}) not found in analytics, adding new entry...`);
            analytics.osType.push({ osName, uniqueClicks: 1, uniqueUsers: [ipAddress] });
        }
        // Track Device Type
        const deviceName = this.getDeviceFromUserAgent(userAgent);
        console.log(`Detected Device: ${deviceName}`);
        const device = analytics.deviceType.find((d) => d.deviceName === deviceName);
        if (device) {
            device.uniqueClicks += 1;
            if (!device.uniqueUsers.includes(ipAddress)) {
                console.log(`New unique user for Device (${deviceName}): ${ipAddress}`);
                device.uniqueUsers.push(ipAddress);
            }
        }
        else {
            console.log(`Device (${deviceName}) not found in analytics, adding new entry...`);
            analytics.deviceType.push({ deviceName, uniqueClicks: 1, uniqueUsers: [ipAddress] });
        }
        console.log(`Updating analytics for alias: ${alias} in database...`);
        await this._urlRepository.updateAnalytics(alias, analytics);
        console.log(`Redirecting to long URL: ${url.longUrl}`);
        return url.longUrl;
    }
    getOSFromUserAgent(userAgent) {
        if (/windows/i.test(userAgent))
            return "Windows";
        if (/mac/i.test(userAgent))
            return "MacOS";
        if (/linux/i.test(userAgent))
            return "Linux";
        return "Unknown";
    }
    getDeviceFromUserAgent(userAgent) {
        if (/mobile/i.test(userAgent))
            return "Mobile";
        if (/tablet/i.test(userAgent))
            return "Tablet";
        return "Desktop";
    }
}
exports.urlService = new URLService(url_repository_1.urlRepository);
