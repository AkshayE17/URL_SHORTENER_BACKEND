import jwt from 'jsonwebtoken';
import { IUser } from '../models/user';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in the environment variables');
}

const JWT_EXPIRATION = '6d';    

export const generateToken = (user: IUser): string => {
  const payload = {
    userId: user._id,
    email: user.email,
    displayName: user.displayName,
  };     

  return jwt.sign(payload, JWT_SECRET , { expiresIn: JWT_EXPIRATION });
};

export const verifyToken = (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          reject(new Error('Token has expired'));
        } else {
          reject(new Error('Invalid token'));
        }
      } else {
        resolve(decoded);
      }
    });
  });
};
