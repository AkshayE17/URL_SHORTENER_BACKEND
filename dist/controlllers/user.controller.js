"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const user_service_1 = require("../service/user.service");
class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async register(req, res) {
        try {
            const user = await this.userService.register(req.body);
            res.status(201).json(user);
        }
        catch (error) {
            console.log('Registration Error:', error);
            res.status(400).json({ message: error.message });
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const { user, token } = await this.userService.login(email, password);
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3600000,
            });
            res.status(200).json({ user, token });
        }
        catch (error) {
            console.log('Login Error:', error);
            res.status(401).json({ message: error.message });
        }
    }
    async loginWithGoogle(req, res) {
        try {
            const { googleId, email, displayName } = req.body;
            const user = await this.userService.loginWithGoogle(googleId, email, displayName);
            res.status(200).json(user);
        }
        catch (error) {
            console.log('Google Login Error:', error); // Log the error
            res.status(400).json({ message: error.message });
        }
    }
}
exports.userController = new UserController(user_service_1.userService);
