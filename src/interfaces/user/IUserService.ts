import { IUser } from "../../models/user";

export interface IUserService {
  register(user: IUser): Promise<{ user: IUser, token: string }>;
  login(email: string, password: string): Promise<{ user: IUser, token: string }>;
  loginWithGoogle(googleId: string, email: string, displayName: string): Promise<{ user: IUser, token: string }>;
}
