import { NestFactory } from "@nestjs/core";
import { MainAppModule } from "./app.module";
import { ValidationPipe, VersioningType, Logger } from "@nestjs/common";
import * as dotenv from "dotenv";
import * as bodyParser from "body-parser";
import { NestExpressApplication } from "@nestjs/platform-express";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import helmet from "helmet";
import { SwaggerConfigInit } from "./configs/swagger.config";
import { ConfigModule } from "@nestjs/config"; 

dotenv.config();

// ✅ گرفتن unhandled errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('🔴 Unhandled Rejection at:', promise);
  console.error('🔴 Reason:', reason);
  console.error('🔴 Stack:', reason instanceof Error ? reason.stack : 'No stack');
});

process.on('uncaughtException', (error) => {
  console.error('🔴 Uncaught Exception:', error);
  console.error('🔴 Stack:', error.stack);
});

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    logger.log('🟢 Step 1: Loading environment variables...');
    logger.log(`REDIS_HOST: ${process.env.REDIS_HOST || 'NOT SET'}`);
    logger.log(`REDIS_PORT: ${process.env.REDIS_PORT || 'NOT SET'}`);
    logger.log(`REDIS_PASSWORD: ${process.env.REDIS_PASSWORD ? '***SET***' : 'NOT SET'}`);
    logger.log(`REDIS_TLS: ${process.env.REDIS_TLS || 'NOT SET'}`);
    logger.log(`APP_PORT: ${process.env.APP_PORT || 'NOT SET'}`);

    logger.log('🟢 Step 1.5: Initializing ConfigModule...');
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigModule available globally
    });


    logger.log('🟢 Step 2: Creating NestJS application...');
    console.log('--- DEBUG REDIS HOST ---');
    console.log('REDIS_HOST IS:', process.env.REDIS_HOST);
    console.log('------------------------');
    const app = await NestFactory.create<NestExpressApplication>(MainAppModule, {
      cors: true,
      bodyParser: true,
      logger: ['error', 'warn', 'log', 'debug'],
    });

    logger.log('🟢 Step 3: Configuring static assets...');
    app.useStaticAssets("public");

    logger.log('🟢 Step 4: Setting timezone...');
    process.env.TZ = "Asia/Tehran";

    logger.log('🟢 Step 5: Setting global prefix...');
    app.setGlobalPrefix("api");

    logger.log('🟢 Step 6: Enabling versioning...');
    app.enableVersioning({ type: VersioningType.URI });

    logger.log('🟢 Step 7: Configuring body parser...');
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    logger.log('🟢 Step 8: Configuring helmet...');
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

    logger.log('🟢 Step 9: Enabling CORS...');
    const corsOptions: CorsOptions = {
      origin: "*",
    };
    app.enableCors(corsOptions);

    logger.log('🟢 Step 10: Initializing Swagger...');
    SwaggerConfigInit(app);

    logger.log('🟢 Step 11: Configuring global pipes...');
    app.useGlobalPipes(new ValidationPipe());

    logger.log('🟢 Step 12: Enabling shutdown hooks...');
    app.enableShutdownHooks();

    logger.log('🟢 Step 13: Starting server...');
    await app.listen(process.env.APP_PORT, () => {
      logger.log(`✅ Application Running on port: ${process.env.APP_PORT}`);
    });

  } catch (error: any) {
    logger.error(`❌ Error in Bootstrap Process`);
    logger.error(`Error name: ${error.name}`);
    logger.error(`Error message: ${error.message}`);
    logger.error(`Error stack: ${error.stack}`);

    // اگه aggregate error هست، همه رو نشون بده
    if (error.errors) {
      logger.error(`🔴 Aggregate errors count: ${error.errors.length}`);
      error.errors.forEach((err, index) => {
        logger.error(`🔴 Error ${index + 1}:`, err.message);
        logger.error(`🔴 Stack ${index + 1}:`, err.stack);
      });
    }

    process.exit(1);
  }
}

bootstrap();
