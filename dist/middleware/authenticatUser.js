"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const authenticateJWT = (req, res, next) => {
    console.log('Auth header:', req.header('Authorization'));
    console.log("token in cookies", req.cookies.token);
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        console.log('No token provided');
        res.status(403).json({ error: 'Access denied' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log('Token decoded successfully:', decoded);
        req.user = decoded;
        next();
    }
    catch (err) {
        console.error('JWT verification failed:', err);
        res.status(403).json({ error: 'Invalid token' });
        return;
    }
};
exports.default = authenticateJWT;
