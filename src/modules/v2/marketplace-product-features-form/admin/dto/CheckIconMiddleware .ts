import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class CheckIconMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!req.file) {
      // اگر آیکون ارسال نشده باشد، فقط بقیه فیلدها را به کنترلر ارسال می‌کند
      req.body.icon = null;
    }
    next();
  }
}
