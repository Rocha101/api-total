import { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
      interface Request {
        user: string | JwtPayload; // Remove the optional '?'
      }
    }
  }

export {};