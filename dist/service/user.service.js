"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_repository_1 = require("../repository/user.repository");
const jwt_1 = require("../util/jwt");
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async register(user) {
        const { email, password, displayName, googleId } = user;
        if (googleId) {
            return this.loginWithGoogle(googleId, email, displayName);
        }
        if (await this.userRepository.findByEmail(email)) {
            throw new Error("Email already exists");
        }
        const hashedPassword = password ? await bcrypt_1.default.hash(password, 10) : undefined;
        const newUser = await this.userRepository.create({
            email,
            password: hashedPassword,
            displayName,
            googleId: undefined,
        });
        // Generate JWT after successful registration
        const token = (0, jwt_1.generateToken)(newUser);
        return { user: newUser, token };
    }
    // Login method for normal users
    async login(email, password) {
        const user = await this.userRepository.findByEmail(email);
        if (!user || !user.password) {
            throw new Error("user not found");
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            throw new Error("password not matching");
        }
        const token = (0, jwt_1.generateToken)(user);
        return { user, token };
    }
    // Login method for Google users (Google authentication)
    async loginWithGoogle(googleId, email, displayName) {
        let user = await this.userRepository.findByGoogleId(googleId);
        if (!user) {
            user = await this.userRepository.create({ googleId, email, displayName });
        }
        // Generate JWT after successful login
        const token = (0, jwt_1.generateToken)(user);
        return { user, token };
    }
}
exports.UserService = UserService;
exports.userService = new UserService(user_repository_1.userRepository);
