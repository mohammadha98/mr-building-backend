import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class WebSocketTokenMiddleware implements NestMiddleware {
  use(req: any, res: Response, next: NextFunction) {
    console.log("WebSocketTokenMiddleware");
    const token = req.headers["authorization"]
      ? req.headers["authorization"]
      : req.handshake.query["authorization"]; // توکن از هدر درخواست استخراج می‌شود
    console.log({ token });
    req.token = token; // توکن را به درخواست اضافه می‌کنیم
    next();
  }
}
