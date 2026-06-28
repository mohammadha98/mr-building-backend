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
        port: Number(process.env.MAIL_PORT),
        secure: false,
        ignoreTLS: true,  
        tls: {
          rejectUnauthorized: false  
        },
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
        // logger: true,
        // debug: true
      },
    }),
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
