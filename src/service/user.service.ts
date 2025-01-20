import bcrypt from "bcrypt";
import { IUserRepository } from "../interfaces/user/IUserRepository";
import { IUser } from "../models/user";
import { userRepository } from "../repository/user.repository";
import { IUserService } from "../interfaces/user/IUserService";
import { generateToken } from "../util/jwt";

export class UserService implements IUserService {

  constructor(private userRepository: IUserRepository) {}

  async register(user: IUser): Promise<{ user: IUser, token: string }> {
    const { email, password, displayName, googleId } = user;

    if (googleId) {
      return this.loginWithGoogle(googleId, email, displayName);
    }

    if (await this.userRepository.findByEmail(email)) {
      throw new Error("Email already exists");
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    const newUser = await this.userRepository.create({
      email,
      password: hashedPassword,
      displayName,
      googleId: undefined, 
    });

    // Generate JWT after successful registration
    const token = generateToken(newUser);

    return { user: newUser, token };
  }

  // Login method for normal users
  async login(email: string, password: string): Promise<{ user: IUser, token: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !user.password) {
      throw new Error("user not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("password not matching");
    }
    const token = generateToken(user);

    return { user, token };
  }

  // Login method for Google users (Google authentication)
  async loginWithGoogle(googleId: string, email: string, displayName: string): Promise<{ user: IUser, token: string }> {
    let user = await this.userRepository.findByGoogleId(googleId);
    if (!user) {
      user = await this.userRepository.create({ googleId, email, displayName });
    }

    // Generate JWT after successful login
    const token = generateToken(user);

    return { user, token };
  }
}

export const userService = new UserService(userRepository);
