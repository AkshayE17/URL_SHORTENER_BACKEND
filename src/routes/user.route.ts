import { Router } from "express";
import { userController } from "../controlllers/user.controller";

const userRouter = Router();

userRouter.post("/register", userController.register.bind(userController));
userRouter.post("/login", userController.login.bind(userController));
userRouter.post("/google-login", userController.loginWithGoogle.bind(userController));

export default userRouter;
