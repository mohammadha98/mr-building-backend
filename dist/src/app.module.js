"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainAppModule = void 0;
const common_1 = require("@nestjs/common");
const logger_middleware_1 = require("./middlewares/logger.middleware");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const moment_1 = require("moment");
const jwt_1 = require("@nestjs/jwt");
const mailer_1 = require("@nestjs-modules/mailer");
const app_module_1 = require("./modules/v1/app/app.module");
const app_module_2 = require("./modules/v2/app/app.module");
let MainAppModule = class MainAppModule {
    configure(consumer) {
        consumer.apply(logger_middleware_1.LoggerMiddleware).forRoutes("*");
    }
};
MainAppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET_KEY,
            }),
            mailer_1.MailerModule.forRoot({
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
                },
            }),
            app_module_2.AppV2Module,
            app_module_1.AppV1Module,
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(process.cwd(), "/public/"),
                serveStaticOptions: { index: false },
            }),
        ],
        providers: [
            {
                provide: "MomentWrapper",
                useValue: moment_1.default,
            },
        ],
    })
], MainAppModule);
exports.MainAppModule = MainAppModule;
//# sourceMappingURL=app.module.js.map