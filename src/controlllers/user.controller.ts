import { Request, Response } from "express";

import { IUserService } from "../interfaces/user/IUserService";
import { userService } from "../service/user.service";

class UserController {

  constructor(private userService: IUserService) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userService.register(req.body);
 
      res.status(201).json(user);
    } catch (error: any) {
      console.log('Registration Error:', error);
      res.status(400).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const { user, token } = await this.userService.login(email, password);
  
  
      res.cookie('token', token, {
        httpOnly: true,  
        secure: process.env.NODE_ENV === 'production',  
        maxAge: 3600000, 
      });
  
      res.status(200).json({ user,token });
    } catch (error: any) {
      console.log('Login Error:', error);  
      res.status(401).json({ message: error.message });
    }
  }
  
  
  async loginWithGoogle(req: Request, res: Response): Promise<void> {
    try {
      const { googleId, email, displayName } = req.body;
      const user = await this.userService.loginWithGoogle(googleId, email, displayName);
      res.status(200).json(user);
    } catch (error: any) {
      console.log('Google Login Error:', error);  // Log the error
      res.status(400).json({ message: error.message });
    }
  }
}

export const userController = new UserController(userService);
   