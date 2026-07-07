"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwaggerConfigInit = void 0;
const swagger_1 = require("@nestjs/swagger");
const basicAuth = require("express-basic-auth");
function SwaggerConfigInit(app) {
    const document = new swagger_1.DocumentBuilder()
        .setTitle("NestJS Backend Api")
        .setDescription("")
        .setVersion("v1.0.0")
        .addServer(`${process.env.APP_URL}`)
        .addServer(`http://localhost:${process.env.PORT}`)
        .addServer(`https://dev.psgapplication.ir`)
        .addServer(`https://dev2.psgapplication.ir`)
        .addServer(`https://api.psgapplication.ir`)
        .addBearerAuth(SwaggerAuthConfig(), "JWT-auth")
        .build();
    const swaggerDocument = swagger_1.SwaggerModule.createDocument(app, document);
    swagger_1.SwaggerModule.setup("private/api-docs", app, swaggerDocument);
    app.use(["/private/api-docs", "/private/api-docs"], basicAuth({
        challenge: true,
        users: {
            ["UserNamE"]: "MyPassword123",
        },
    }));
}
exports.SwaggerConfigInit = SwaggerConfigInit;
function SwaggerAuthConfig() {
    return {
        type: "http",
        bearerFormat: "JWT",
        in: "header",
        scheme: "bearer",
    };
}
//# sourceMappingURL=swagger.config.js.map