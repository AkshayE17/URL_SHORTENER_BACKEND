import { Request, Response } from "express";

import { IUserService } from "../interfaces/user/IUserService";
import { userService } from "../service/user.service";
import { HttpStatus } from "../enums/httpStatus";
import { ErrorMessages } from "../enums/messages";

class UserController {
  constructor(private userService: IUserService) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userService.register(req.body);
      res.status(HttpStatus.CREATED).json(user);
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: ErrorMessages.REGISTRATION_ERROR });
      } else {
        console.error("Unexpected Error:", error);
        res.status(HttpStatus.BAD_REQUEST).json({ message: ErrorMessages.UNKNOWN_ERROR });
      }
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const { user, token } = await this.userService.login(email, password);

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000, // 1 hour in milliseconds
      });

      res.status(HttpStatus.OK).json({ user, token });
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: ErrorMessages.LOGIN_ERROR });
      } else {
        res.status(HttpStatus.UNAUTHORIZED).json({ message:ErrorMessages.UNKNOWN_ERROR });
      }
    }
  }

  async loginWithGoogle(req: Request, res: Response): Promise<void> {
    try {
      const { googleId, email, displayName } = req.body;
      const user = await this.userService.loginWithGoogle(googleId, email, displayName);
      res.status(HttpStatus.OK).json(user);
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: ErrorMessages.GOOGLE_LOGIN_ERROR });
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({ message: ErrorMessages.UNKNOWN_ERROR });
      }
    }
  }
}

export const userController = new UserController(userService);