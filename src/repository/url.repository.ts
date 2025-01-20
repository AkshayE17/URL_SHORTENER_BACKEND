import { URLModel, IURL, ITopicAnalytics, IOverallAnalytics } from "../models/url";
import { IURLRepository } from "../interfaces/url/IUrlRepository";
import { Types } from "mongoose";

class URLRepository implements IURLRepository {
  async createURL(urlData: Partial<IURL>): Promise<IURL> {
    try {
      const createdUrl = await URLModel.create(urlData);
      
      
      return createdUrl;
    } catch (error) {
      console.error('Error in URL creation in repository:', error);
      throw new Error('Failed to save URL');
    }
  }
  

  async findURLByAlias(alias: string): Promise<IURL | null> {
    return URLModel.findOne({ customAlias: alias });
  }




  async updateAnalytics(alias: string, analyticsUpdate: Partial<IURL["analytics"]>): Promise<void> {
    await URLModel.updateOne({ customAlias: alias }, { $set: { analytics: analyticsUpdate } });
  }

  async getURLsByTopic(topic: string): Promise<ITopicAnalytics[]> {
    return URLModel.aggregate([
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

  async getOverallAnalytics(userId: Types.ObjectId): Promise<IOverallAnalytics | null> {
    const result = await URLModel.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalUrls: { $sum: 1 },
          totalClicks: { $sum: "$analytics.totalClicks" },
          uniqueUsers: {
            $addToSet: "$analytics.uniqueUsers"  // Changed this line
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
                input: { $ifNull: ["$uniqueUsers", []] },  // Removed arrayElemAt
                initialValue: [],
                in: { 
                  $setUnion: ["$$value", { $ifNull: ["$$this", []] }]  // Added ifNull check
                },
              },
            },
          },
          clicksByDate: 1,
          osType: {
            $map: {
              input: { $ifNull: ["$osType", []] },  // Added ifNull check
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
              input: { $ifNull: ["$deviceType", []] },  // Added ifNull check
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
  
  async getUserURLs(userId: string): Promise<IURL[]> {
    return URLModel.find({ userId });
  }
}

export const urlRepository = new URLRepository();
