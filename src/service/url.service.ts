import { IURLRepository } from "../interfaces/url/IUrlRepository";
import { IURLService } from "../interfaces/url/IUrlService";
import { IOverallAnalytics, ITopicAnalytics, ITransformedAnalytics, IURL } from "../models/url";
import { urlRepository } from "../repository/url.repository";
import { Types } from "mongoose";
import { ErrorMessages } from "../enums/messages";

class URLService implements IURLService {
  constructor(private _urlRepository: IURLRepository) {}

  async createShortURL(longUrl: string, customAlias: string | undefined, userId: string, topic: string | undefined): Promise<IURL> {
    try {
      const alias = customAlias || this.generateAlias();
      const shortUrl = `${process.env.baseUrl}/shorten/${alias}`;
      const userIdObject = new Types.ObjectId(userId);
      
      if (customAlias) {
        const existingUrl = await this._urlRepository.findURLByAlias(customAlias);
        if (existingUrl) {
          throw new Error(ErrorMessages.URL_NOT_FOUND);
        }
      }

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
        throw new Error(ErrorMessages.UNKNOWN_ERROR);
      }
      
      return url;
    } catch (error) {
      throw new Error(ErrorMessages.UNKNOWN_ERROR);
    }
  }

  async getAnalyticsByAlias(alias: string): Promise<ITransformedAnalytics | null> {
    try {
      const url = await this._urlRepository.findURLByAlias(alias);
      if (!url) {
        throw new Error(ErrorMessages.URL_NOT_FOUND);
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
    } catch (error) {
      throw new Error(ErrorMessages.UNKNOWN_ERROR);
    }
  }

  async getURLsByTopic(topic: string): Promise<ITopicAnalytics | null> {
    try {
      const result = await this._urlRepository.getURLsByTopic(topic);
      if (result.length === 0) return null; 
      return result[0]; 
    } catch (error) {
      throw new Error(ErrorMessages.UNKNOWN_ERROR);
    }
  }

  async getOverallAnalytics(userId: Types.ObjectId): Promise<IOverallAnalytics | null> {
    try {
      const result = await this._urlRepository.getOverallAnalytics(userId);
      if (!result) return null;
      return result;
    } catch (error) {
      throw new Error(ErrorMessages.UNKNOWN_ERROR);
    }
  }

  private generateAlias(): string {
    return Math.random().toString(36).substring(2, 8);
  }

  async redirectAndTrackAnalytics(alias: string, userAgent: string, ipAddress: string): Promise<string | null> {
    try {
      const url = await this._urlRepository.findURLByAlias(alias);
      if (!url) {
        throw new Error(ErrorMessages.URL_NOT_FOUND);
      }
      
      const analytics = url.analytics;
      analytics.totalClicks += 1;

      if (!analytics.uniqueUsers.includes(ipAddress)) {
        analytics.uniqueUsers.push(ipAddress);
      }

      const today = new Date().toISOString().split("T")[0];
      if (!analytics.clicksByDate.has(today)) {
        analytics.clicksByDate.set(today, 0);
      }
      analytics.clicksByDate.set(today, analytics.clicksByDate.get(today)! + 1);

      const osName = this.getOSFromUserAgent(userAgent);
      const os = analytics.osType.find((o) => o.osName === osName);
      if (os) {
        os.uniqueClicks += 1;
        if (!os.uniqueUsers.includes(ipAddress)) {
          os.uniqueUsers.push(ipAddress);
        }
      } else {
        analytics.osType.push({ osName, uniqueClicks: 1, uniqueUsers: [ipAddress] });
      }

      const deviceName = this.getDeviceFromUserAgent(userAgent);
      const device = analytics.deviceType.find((d) => d.deviceName === deviceName);
      if (device) {
        device.uniqueClicks += 1;
        if (!device.uniqueUsers.includes(ipAddress)) {
          device.uniqueUsers.push(ipAddress);
        }
      } else {
        analytics.deviceType.push({ deviceName, uniqueClicks: 1, uniqueUsers: [ipAddress] });
      }

      await this._urlRepository.updateAnalytics(alias, analytics);

      return url.longUrl;
    } catch (error) {
      throw new Error(ErrorMessages.UNKNOWN_ERROR);
    }
  }

  private getOSFromUserAgent(userAgent: string): string {
    if (/windows/i.test(userAgent)) return "Windows";
    if (/mac/i.test(userAgent)) return "MacOS";
    if (/linux/i.test(userAgent)) return "Linux";
    return "Unknown";
  }

  private getDeviceFromUserAgent(userAgent: string): string {
    if (/mobile/i.test(userAgent)) return "Mobile";
    if (/tablet/i.test(userAgent)) return "Tablet";
    return "Desktop";
  }
}

export const urlService = new URLService(urlRepository);
