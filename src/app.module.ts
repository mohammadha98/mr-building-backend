import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { LoggerMiddleware } from "src/middlewares/logger.middleware";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import moment from "moment";
import { JwtModule } from "@nestjs/jwt";
import { MailerModule } from "@nestjs-modules/mailer";
import { AppV1Module } from "./modules/v1/app/app.module";
import { AppV2Module } from "./modules/v2/app/app.module";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
    }),

    MailerModule.forRoot({
      transport: {
        host: String(process.env.MAIL_HOST),
        port: Number(process.env.MAIL_PORT || 587),
        secure:
          String(process.env.MAIL_SECURE || "false").toLowerCase() === "true" ||
          Number(process.env.MAIL_PORT || 587) === 465,
        ignoreTLS:
          String(process.env.MAIL_IGNORE_TLS || "false").toLowerCase() ===
          "true",
        requireTLS:
          String(process.env.MAIL_REQUIRE_TLS || "false").toLowerCase() ===
          "true",
        tls: {
          rejectUnauthorized:
            String(
              process.env.MAIL_TLS_REJECT_UNAUTHORIZED || "false"
            ).toLowerCase() === "true",
        },
        ...(process.env.MAIL_USER || process.env.MAIL_USERNAME
          ? {
              auth: {
                user: process.env.MAIL_USER || process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASS || process.env.MAIL_PASSWORD,
              },
            }
          : {}),
      },
    }),
    AppV1Module,
    AppV2Module,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), "/public/"),
      serveStaticOptions: { index: false },
    }),
  ],
  providers: [
    {
      provide: "MomentWrapper",
      useValue: moment,
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: TransformerInterceptor,
    // },
  ],
})
export class MainAppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
