import { Types } from "mongoose";
import { IOverallAnalytics, ITopicAnalytics, IURL } from "../../models/url";

export interface IURLRepository {
  createURL(urlData: Partial<IURL>): Promise<IURL>;
  findURLByAlias(alias: string): Promise<IURL | null>;
  updateAnalytics(alias: string, analyticsUpdate: Partial<IURL["analytics"]>): Promise<void>;
  getURLsByTopic(topic: string): Promise<ITopicAnalytics[]>;
  getUserURLs(userId: string): Promise<IURL[]>;
  getOverallAnalytics(userId: Types.ObjectId): Promise<IOverallAnalytics | null>
}


   