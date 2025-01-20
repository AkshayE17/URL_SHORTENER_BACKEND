import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
  console.log('Auth header:', req.header('Authorization'));
  console.log("token in cookies", req.cookies.token);
  const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    console.log('No token provided'); 
    res.status(403).json({ error: 'Access denied' });
    return;
  }  
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as Express.User;
    console.log('Token decoded successfully:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT verification failed:', err);
    res.status(403).json({ error: 'Invalid token' });
    return;
  }
};

export default authenticateJWT;