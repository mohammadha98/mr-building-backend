"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const helmet_1 = require("helmet");
const swagger_config_1 = require("./configs/swagger.config");
const config_1 = require("@nestjs/config");
dotenv.config();
process.on("unhandledRejection", (reason, promise) => {
    console.error("🔴 Unhandled Rejection at:", promise);
    console.error("🔴 Reason:", reason);
    console.error("🔴 Stack:", reason instanceof Error ? reason.stack : "No stack");
});
process.on("uncaughtException", (error) => {
    console.error("🔴 Uncaught Exception:", error);
    console.error("🔴 Stack:", error.stack);
});
async function bootstrap() {
    var _a, _b;
    const logger = new common_1.Logger("Bootstrap");
    try {
        logger.log("🟢 Step 1: Loading environment variables...");
        logger.log(`REDIS_HOST: ${process.env.REDIS_HOST || "NOT SET"}`);
        logger.log(`REDIS_PORT: ${process.env.REDIS_PORT || "NOT SET"}`);
        logger.log(`REDIS_PASSWORD: ${process.env.REDIS_PASSWORD ? "***SET***" : "NOT SET"}`);
        logger.log(`REDIS_TLS: ${process.env.REDIS_TLS || "NOT SET"}`);
        logger.log(`APP_PORT: ${process.env.APP_PORT || "NOT SET"}`);
        logger.log("🟢 Step 1.5: Initializing ConfigModule...");
        config_1.ConfigModule.forRoot({
            isGlobal: true,
        });
        logger.log("🟢 Step 2: Creating NestJS application...");
        console.log("--- DEBUG REDIS HOST ---");
        console.log("REDIS_HOST IS:", process.env.REDIS_HOST);
        console.log("------------------------");
        const app = await core_1.NestFactory.create(app_module_1.MainAppModule, {
            cors: true,
            bodyParser: true,
            logger: ["error", "warn", "log", "debug"],
        });
        logger.log("🟢 Step 3: Configuring static assets...");
        app.useStaticAssets("public");
        logger.log("🟢 Step 4: Setting timezone...");
        process.env.TZ = "Asia/Tehran";
        logger.log("🟢 Step 5: Setting global prefix...");
        app.setGlobalPrefix("api");
        logger.log("🟢 Step 6: Enabling versioning...");
        app.enableVersioning({ type: common_1.VersioningType.URI });
        logger.log("🟢 Step 7: Configuring body parser...");
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());
        logger.log("🟢 Step 8: Configuring helmet...");
        app.use((0, helmet_1.default)({
            crossOriginEmbedderPolicy: true,
            crossOriginResourcePolicy: true,
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["*"],
                    scriptSrc: ["* data: 'unsafe-eval' 'unsafe-inline' blob:"],
                },
            },
        }));
        logger.log("🟢 Step 9: Enabling CORS...");
        const corsOptions = {
            origin: "*",
        };
        app.enableCors(corsOptions);
        logger.log("🟢 Step 10: Initializing Swagger...");
        (0, swagger_config_1.SwaggerConfigInit)(app);
        logger.log("🟢 Step 11: Configuring global pipes...");
        app.useGlobalPipes(new common_1.ValidationPipe());
        logger.log("🟢 Step 12: Enabling shutdown hooks...");
        app.enableShutdownHooks();
        logger.log("🟢 Step 13: Starting server...");
        const port = Number((_b = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : process.env.APP_PORT) !== null && _b !== void 0 ? _b : 3000);
        if (Number.isNaN(port)) {
            throw new Error(`Invalid port value. PORT=${process.env.PORT}, APP_PORT=${process.env.APP_PORT}`);
        }
        await app.listen(port, "0.0.0.0", () => {
            logger.log(`✅ Application Running on port: ${port}`);
        });
    }
    catch (error) {
        logger.error(`❌ Error in Bootstrap Process`);
        logger.error(`Error name: ${error.name}`);
        logger.error(`Error message: ${error.message}`);
        logger.error(`Error stack: ${error.stack}`);
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
//# sourceMappingURL=main.js.map