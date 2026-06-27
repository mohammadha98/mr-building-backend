import { Injectable, NestMiddleware, Logger } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger("HTTP");
  constructor(private prismaService: PrismaService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, baseUrl } = req;
    const ip =
      (req.headers["x-forwarded-for"] as string) ||
      (req.socket.remoteAddress as string);

    req.ip_address = ip;

    // TODO: test log in Logger Middleware
    this.logger.log("--- Logger ---");
    this.logger.log(`Ip: ${ip}`);
    this.logger.log(`clientId: ${req.client.id}`);

    const userAgent = req.get("user-agent") || "";
    const startAt = process.hrtime();

    res.on("finish", async () => {
      const { statusCode } = res;
      const contentLength = res.get("content-length");
      const diff = process.hrtime(startAt);
      const responseTime = diff[0] * 1e3 + diff[1] * 1e-6;

      if (
        statusCode == 400 ||
        statusCode == 401 ||
        statusCode == 403 ||
        statusCode == 404 ||
        statusCode === 422 ||
        statusCode === 500 ||
        statusCode == 401
      ) {
        try {
          // save log info
          await this.prismaService.logger.create({
            data: {
              method,
              baseUrl,
              status_code: statusCode,
              content_length: contentLength || "0",
              response_time: responseTime.toFixed(2),
              user_agent: userAgent,
              ip,
            },
          });

          // console log in terminal
          this.logger.log(
            `${method} ${baseUrl} ${statusCode} ${contentLength} - ${responseTime.toFixed(
              2
            )} ms ${userAgent} ${ip} `
          );
        } catch (error) {
          next(error);
        }
      }
    });

    next();
  }
}
