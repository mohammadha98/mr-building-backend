"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const helmet_1 = require("helmet");
const swagger_config_1 = require("./configs/swagger.config");
dotenv.config();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.MainAppModule, {
        cors: true,
        bodyParser: true,
    });
    app.useStaticAssets("public");
    process.env.TZ = "Asia/Tehran";
    app.setGlobalPrefix("api");
    app.enableVersioning({ type: common_1.VersioningType.URI });
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    helmet_1.default;
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
    const corsOptions = {
        origin: "*",
    };
    app.enableCors(corsOptions);
    (0, swagger_config_1.SwaggerConfigInit)(app);
    app.useStaticAssets("public/");
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.enableShutdownHooks();
    try {
        await app.listen(process.env.APP_PORT, () => {
            console.log(`Application Running on port: ${process.env.APP_PORT}`);
        });
    }
    catch (error) {
        console.log(`Error in Start Server`);
        console.log(error);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map