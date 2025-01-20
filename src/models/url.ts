import mongoose, { Document, Schema, Types } from "mongoose";

export interface IURLAnalytics {
  totalClicks: number;
  uniqueUsers: string[]; // Simplified to array for easier serialization
  clicksByDate: Map<string, number>;
  osType: { 
    osName: string; 
    uniqueClicks: number; 
    uniqueUsers: string[] 
  }[];
  deviceType: { 
    deviceName: string; 
    uniqueClicks: number; 
    uniqueUsers: string[] 
  }[];
}


export interface ITransformedAnalytics {
  totalClicks: number;
  uniqueUsers: number;
  clicksByDate: Record<string, number>; 
  osType: {
    osName: string;
    uniqueClicks: number;
    uniqueUsers: number;
  }[];
  deviceType: {
    deviceName: string;
    uniqueClicks: number;
    uniqueUsers: number;
  }[];
}

export interface ITopicAnalytics {
  totalClicks: number;
  uniqueUsers: number;
  clicksByDate: Record<string, number>;
  urls: {
    shortUrl: string;
    totalClicks: number;
    uniqueUsers: number;
  }[];
}


export interface IOverallAnalytics {
  totalUrls: number;           
  totalClicks: number;           
  uniqueUsers: number;           
  clicksByDate: {              
    [date: string]: number;      
  };
  osType: {                     
    osName: string;              
    uniqueClicks: number;        
    uniqueUsers: number;        
  }[];
  deviceType: {               
    deviceName: string;          
    uniqueClicks: number;        
    uniqueUsers: number;         
  }[];
}


export interface IURL extends Document {
  longUrl: string;
  shortUrl: string;
  customAlias?: string;
  userId: Types.ObjectId;
  topic?: string;
  createdAt: Date;
  analytics: IURLAnalytics;
}

const urlSchema = new Schema<IURL>({
  longUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
  customAlias: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  topic: { type: String },
  analytics: {
    totalClicks: { type: Number, default: 0 },
    uniqueUsers: { type: [String], default: [] },
    clicksByDate: { type: Map, of: Number, default: {} },
    osType: { 
      type: [
        { 
          osName: { type: String, required: true }, 
          uniqueClicks: { type: Number, default: 0 }, 
          uniqueUsers: { type: [String], default: [] } 
        }
      ], 
      default: [] 
    },
    deviceType: { 
      type: [
        { 
          deviceName: { type: String, required: true }, 
          uniqueClicks: { type: Number, default: 0 }, 
          uniqueUsers: { type: [String], default: [] } 
        }
      ], 
      default: [] 
    }
  }
}, { timestamps: true });

export const URLModel = mongoose.model<IURL>("URL", urlSchema);
