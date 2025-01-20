"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controlllers/user.controller");
const userRouter = (0, express_1.Router)();
userRouter.post("/register", user_controller_1.userController.register.bind(user_controller_1.userController));
userRouter.post("/login", user_controller_1.userController.login.bind(user_controller_1.userController));
userRouter.post("/google-login", user_controller_1.userController.loginWithGoogle.bind(user_controller_1.userController));
exports.default = userRouter;
