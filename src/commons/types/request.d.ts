import { Client, users } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      client?: Client;
      user?: users;
      ip_address: string;
    }
  }
}
