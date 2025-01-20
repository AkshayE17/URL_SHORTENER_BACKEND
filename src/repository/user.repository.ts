import { IUserRepository } from "../interfaces/user/IUserRepository";
import { IUser } from "../models/user";
import UserModel from "../models/user";


class UserRepository implements IUserRepository {
  async create(user: IUser): Promise<IUser> {
    return await UserModel.create(user);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({ email });
  }

  async findByGoogleId(googleId: string): Promise<IUser | null> {
    return await UserModel.findOne({ googleId });
  }
}

export const userRepository = new UserRepository();