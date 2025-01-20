import { Request, Response } from "express";
import { IURLService } from "../interfaces/url/IUrlService";
import { urlService } from "../service/url.service";
import { IUser } from "../models/user";
import { ObjectId } from 'mongodb';


class URLController {
  constructor(private _urlService: IURLService) {}
  async createShortURL(req: Request, res: Response): Promise<void> {  
    try {
      const { longUrl, customAlias, topic } = req.body;

      const userId=req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }
      console.log('Received request to create short URL:', { longUrl, customAlias, topic, userId });
  
      const url = await this._urlService.createShortURL(longUrl, customAlias, userId, topic);
      
      console.log('Returning response:', { url });
      res.status(201).json({ url });
      
    } catch (error) {
      console.error('Error occurred:', error);
      if (!res.headersSent) {
        res.status(500).json({ 
          error: error instanceof Error ? error.message : "An unknown error occurred" 
        });
      }
    }
  }
  

  async getAnalytics(req: Request, res: Response): Promise<Response> {
    try {
      const { alias } = req.params;
      const analytics = await this._urlService.getAnalyticsByAlias(alias);
      if (!analytics) {
        return res.status(404).json({ error: "URL not found" });
      }
      return res.json(analytics);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      } else {
        console.error("Unknown error type:", error);
        return res.status(500).json({ error: "An unknown error occurred" });
      }
    }
  }

  async getAnalyticsByTopic(req: Request, res: Response): Promise<Response> {
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
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      } else {
        console.error("Unknown error type:", error);
        return res.status(500).json({ error: "An unknown error occurred" });
      }
    }
  }
  
    

  async redirectToLongUrl(req: Request, res: Response): Promise<void> {
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
    } catch (error) {
      console.error("Error occurred:", error);
  
      res.status(500).json({
        error: error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  }
  

  async getOverallAnalytics(req: Request, res: Response): Promise<Response> {
    try {
     console.log("entering")
     if(!req.user){
      return res.status(401).json({ error: "User not authenticated" });
     }

       
      
      const userId = req.user.userId;
      if(!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      console.log("userId",userId);
       
    const userIdObj = new ObjectId(userId);
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
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      } else {
        console.error("Unknown error type:", error);
        return res.status(500).json({ error: "An unknown error occurred" });
      }
    }
  }
  
  
  

}

export const urlController = new URLController(urlService);
