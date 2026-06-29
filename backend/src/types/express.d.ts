import { User } from "../features/auth/auth.type";

declare global {
  namespace Express {
    interface Request {
      user: User;
      cookies: string;
    }
  }
}

export {};
