import { Request, Response } from "express";
import { IURLService } from "../interfaces/url/IUrlService";
import { urlService } from "../service/url.service";
import { ObjectId } from "mongodb";
import { HttpStatus } from "../enums/httpStatus";
import { ErrorMessages } from "../enums/messages";

class URLController {
  constructor(private _urlService: IURLService) {}

  async createShortURL(req: Request, res: Response): Promise<void> {
    try {
      const { longUrl, customAlias, topic } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ error: ErrorMessages.USER_NOT_AUTHENTICATED });
        return;
      }

      const url = await this._urlService.createShortURL(longUrl, customAlias, userId, topic);
      res.status(HttpStatus.CREATED).json({ url });
    } catch (error) {
      if (!res.headersSent) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          error: error instanceof Error ? error.message : ErrorMessages.UNKNOWN_ERROR,
        });
      }
    }
  }

  async getAnalytics(req: Request, res: Response): Promise<Response> {
    try {
      const { alias } = req.params;
      const analytics = await this._urlService.getAnalyticsByAlias(alias);

      if (!analytics) {
        return res.status(HttpStatus.NOT_FOUND).json({ error: ErrorMessages.URL_NOT_FOUND });
      }

      return res.status(HttpStatus.OK).json(analytics);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: error instanceof Error ? error.message : ErrorMessages.UNKNOWN_ERROR,
      });
    }
  }

  async getAnalyticsByTopic(req: Request, res: Response): Promise<Response> {
    try {
      const { topic } = req.params;
      const analytics = await this._urlService.getURLsByTopic(topic);

      if (!analytics) {
        return res.status(HttpStatus.NOT_FOUND).json({ error: ErrorMessages.TOPIC_NOT_FOUND });
      }

      return res.status(HttpStatus.OK).json({
        totalClicks: analytics.totalClicks,
        uniqueUsers: analytics.uniqueUsers,
        clicksByDate: analytics.clicksByDate,
        urls: analytics.urls,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: error instanceof Error ? error.message : ErrorMessages.UNKNOWN_ERROR,
      });
    }
  }

  async redirectToLongUrl(req: Request, res: Response): Promise<void> {
    try {
      const { alias } = req.params;
      const userAgent = req.headers["user-agent"] || "";
      const ipAddress = req.ip;

      const longUrl = await this._urlService.redirectAndTrackAnalytics(alias, userAgent, ipAddress);

      if (!longUrl) {
        res.status(HttpStatus.NOT_FOUND).json({ error: ErrorMessages.URL_NOT_FOUND });
        return;
      }

      res.redirect(longUrl);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: error instanceof Error ? error.message : ErrorMessages.UNKNOWN_ERROR,
      });
    }
  }

  async getOverallAnalytics(req: Request, res: Response): Promise<Response> {
    try {

      if (!req.user) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ error: ErrorMessages.USER_NOT_AUTHENTICATED });
      }

      const userId = req.user.userId;
      if (!userId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ error: ErrorMessages.USER_NOT_AUTHENTICATED });
      }

      const userIdObj = new ObjectId(userId);
      const analytics = await this._urlService.getOverallAnalytics(userIdObj);

      if (!analytics) {
        return res.status(HttpStatus.NOT_FOUND).json({ error: ErrorMessages.TOPIC_NOT_FOUND });
      }

      return res.status(HttpStatus.OK).json({
        totalUrls: analytics.totalUrls,
        totalClicks: analytics.totalClicks,
        uniqueUsers: analytics.uniqueUsers,
        clicksByDate: analytics.clicksByDate,
        osType: analytics.osType,
        deviceType: analytics.deviceType,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: error instanceof Error ? error.message : ErrorMessages.UNKNOWN_ERROR,
      });
    }
  }
}

export const urlController = new URLController(urlService);
