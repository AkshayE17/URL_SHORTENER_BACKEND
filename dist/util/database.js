"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = connectDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
async function connectDatabase() {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log('Database connected');
    }
    catch (error) {
        console.error('Database connection error:', error);
    }
}
