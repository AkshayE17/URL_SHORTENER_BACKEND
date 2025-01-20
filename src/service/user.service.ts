import bcrypt from "bcrypt";
import { IUserRepository } from "../interfaces/user/IUserRepository";
import { IUser } from "../models/user";
import { userRepository } from "../repository/user.repository";
import { IUserService } from "../interfaces/user/IUserService";
import { generateToken } from "../util/jwt";
import { ErrorMessages } from "../enums/messages";

export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  // Register a new user
  async register(user: IUser): Promise<{ user: IUser; token: string }> {
    try {
      const { email, password, displayName, googleId } = user;

      if (googleId) {
        return this.loginWithGoogle(googleId, email, displayName);
      }

      if (await this.userRepository.findByEmail(email)) {
        throw new Error(ErrorMessages.EMAIL_EXISTS || "Email already exists");
      }

      const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

      const newUser = await this.userRepository.create({
        email,
        password: hashedPassword,
        displayName,
        googleId: undefined,
      });

      const token = generateToken(newUser);

      return { user: newUser, token };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message || ErrorMessages.REGISTRATION_ERROR || "Failed to register user");
      }
      throw new Error(ErrorMessages.UNKNOWN_ERROR || "An unknown error occurred during registration");
    }
  }

  // Login method for regular users
  async login(email: string, password: string): Promise<{ user: IUser; token: string }> {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user || !user.password) {
        throw new Error(ErrorMessages.USER_NOT_FOUND || "User not found");
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error(ErrorMessages.PASSWORD_MISMATCH || "Password is incorrect");
      }

      const token = generateToken(user);

      return { user, token };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message || ErrorMessages.LOGIN_ERROR || "Login failed");
      }
      throw new Error(ErrorMessages.UNKNOWN_ERROR || "An unknown error occurred during login");
    }
  }

  // Login method for Google users
  async loginWithGoogle(googleId: string, email: string, displayName: string): Promise<{ user: IUser; token: string }> {
    try {
      let user = await this.userRepository.findByGoogleId(googleId);
      if (!user) {
        user = await this.userRepository.create({ googleId, email, displayName });
      }

      const token = generateToken(user);

      return { user, token };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message || ErrorMessages.GOOGLE_LOGIN_ERROR || "Google login failed");
      }
      throw new Error(ErrorMessages.UNKNOWN_ERROR || "An unknown error occurred during Google login");
    }
  }
}

export const userService = new UserService(userRepository);
