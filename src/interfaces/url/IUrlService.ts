import { Types } from "mongoose";
import { IOverallAnalytics, ITopicAnalytics, ITransformedAnalytics, IURL } from "../../models/url.js";


export interface IURLService {
  createShortURL( longUrl: string, customAlias: string | undefined, userId: string,  topic: string | undefined): Promise<IURL>;
  
  getAnalyticsByAlias(alias: string): Promise<ITransformedAnalytics | null>

  getURLsByTopic(topic: string): Promise<ITopicAnalytics | null>

  redirectAndTrackAnalytics(alias: string, userAgent: string, ipAddress: string | undefined): Promise<string | null> ;

  getOverallAnalytics(userId: Types.ObjectId | null): Promise<IOverallAnalytics | null> 


}
