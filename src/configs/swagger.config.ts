import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { SecuritySchemeObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import * as basicAuth from "express-basic-auth";

export function SwaggerConfigInit(app: INestApplication): void {
  const document = new DocumentBuilder()
    .setTitle("NestJS Backend Api")
    .setDescription("")
    .setVersion("v1.0.0")
    .addServer(`http://localhost:${process.env.PORT}`)
    .addServer(`https://dev.psgapplication.ir`)
    .addServer(`https://dev2.psgapplication.ir`)
    .addServer(`https://api.psgapplication.ir`)
    .addBearerAuth(SwaggerAuthConfig(), "JWT-auth")
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, document);
  SwaggerModule.setup("private/api-docs", app, swaggerDocument);

  // set password for swagger ui
  app.use(
    ["/private/api-docs", "/private/api-docs"],
    basicAuth({
      challenge: true,
      users: {
        ["UserNamE"]: "MyPassword123",
      },
    })
  );
}

function SwaggerAuthConfig(): SecuritySchemeObject {
  return {
    type: "http",
    bearerFormat: "JWT",
    in: "header",
    scheme: "bearer",
  };
}
