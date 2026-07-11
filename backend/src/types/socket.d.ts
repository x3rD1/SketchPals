import { User } from "@prisma/client";
import "socket.io";

declare module "socket.io" {
  interface Socket {
    user: User;
  }
}

export {};
