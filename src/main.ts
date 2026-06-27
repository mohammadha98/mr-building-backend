import { NestFactory } from "@nestjs/core";
import { MainAppModule } from "./app.module";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import * as dotenv from "dotenv";
import * as bodyParser from "body-parser";
import { NestExpressApplication } from "@nestjs/platform-express";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import helmet from "helmet";
import { SwaggerConfigInit } from "./configs/swagger.config";

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(MainAppModule, {
    cors: true,
    bodyParser: true,
  });

  app.useStaticAssets("public");
  // set timezone
  process.env.TZ = "Asia/Tehran";
  // Prefix
  app.setGlobalPrefix("api");
  // Versioning
  app.enableVersioning({ type: VersioningType.URI });
  // body parser configuration
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  helmet;
  app.use(
    helmet({
      crossOriginEmbedderPolicy: true,
      crossOriginResourcePolicy: true,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["*"],
          scriptSrc: ["* data: 'unsafe-eval' 'unsafe-inline' blob:"],
        },
      },
    })
  );

  // cors configuration
  const corsOptions: CorsOptions = {
    origin: "*",
  };
  app.enableCors(corsOptions);

  // swagger configuration
  SwaggerConfigInit(app);

  // Serve Static path
  app.useStaticAssets("public/");

  app.useGlobalPipes(new ValidationPipe());

  // ✅ اضافه کردن Graceful Shutdown
  app.enableShutdownHooks();

  try {
    await app.listen(process.env.APP_PORT, () => {
      console.log(`Application Running on port: ${process.env.APP_PORT}`);
    });
  } catch (error) {
    console.log(`Error in Start Server`);
    console.log(error);
  }
}

bootstrap();
