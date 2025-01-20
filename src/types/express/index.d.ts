import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface User extends JwtPayload {
      userId: string;
      email: string;
      displayName: string;
    }
    
    interface Request {
      user?: User;
    }
  }
}