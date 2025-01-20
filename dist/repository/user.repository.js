"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = void 0;
const user_1 = __importDefault(require("../models/user"));
class UserRepository {
    async create(user) {
        return await user_1.default.create(user);
    }
    async findByEmail(email) {
        return await user_1.default.findOne({ email });
    }
    async findByGoogleId(googleId) {
        return await user_1.default.findOne({ googleId });
    }
}
exports.userRepository = new UserRepository();
