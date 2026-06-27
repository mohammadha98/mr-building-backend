import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Res,
  Response,
  Request,
  Get,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterAuthDto } from "./dto/register-auth.dto";
import { VerifyAuthDto } from "./dto/verify-auth.dto";
import CodeGenerator from "src/modules/services/codeGenerator";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
  getSchemaPath,
} from "@nestjs/swagger";
import { BadRequestErrorHandler } from "src/modules/services/httpResponseHandler/badRequestErrorHandler";
import BadRequestSchema from "src/commons/contracts/swaggerDefinations/BadRequestSchema";
import InternalServerErrorSchema from "src/commons/contracts/swaggerDefinations/InternalServerErrorSchema";
import NotFoundSchema from "src/commons/contracts/swaggerDefinations/NotFoundSchema";
import UnProcessableEntitySchema from "src/commons/contracts/swaggerDefinations/UnProcessableEntitySchema";
import { FormDataRequest } from "nestjs-form-data";
import { InternalServerErrorHandler } from "src/modules/services/httpResponseHandler/internalServerErrorHandler";
import ClientTransformer from "src/modules/v1//client/app/Transformer";

@ApiTags("v1/register")
@Controller("v1/auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly clientTransformer: ClientTransformer,
    private readonly responseHandler: HttpResponsehandler
  ) {}

  // register client
  // ok response
  @ApiOkResponse({
    description: "کد تایید ارسال شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 200 },
        message: { type: "string", example: "کد تایید ارسال شد." },
        error: { type: "string", example: "" },
        data: {
          type: "object",
          properties: {
            code: { type: "string", example: "1234" },
          },
        },
      },
    },
  })

  // NotFound Response
  @ApiNotFoundResponse({
    description: "خطا. آدرس موردنظر یافت نشد",
    type: NotFoundSchema,
    schema: {
      $ref: getSchemaPath(NotFoundSchema),
    },
  })

  // UnprocessableEntity Response
  @ApiUnprocessableEntityResponse({
    description:
      "خطا. مقادیر ارسالی اشتباه هستند. در فیلد مسیج مقادیر اشتباه قرار دارند.",
    type: UnProcessableEntitySchema,
    schema: {
      $ref: getSchemaPath(UnProcessableEntitySchema),
    },
  })

  // InternalServerError Response
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorSchema,
    description: "خطای سرور. لطفا کمی بعد تلاش کنید",
    schema: {
      $ref: getSchemaPath(InternalServerErrorSchema),
    },
  })
  @ApiOperation({ summary: "ثبت نام شماره کاربران" })
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  @ApiBody({ type: RegisterAuthDto })
  @Post("/register")
  async register(
    @Body() RegisterAuthDto: RegisterAuthDto,
    @Request() req: any,
    @Res() res: Response
  ) {
    console.log("*** register ***");
    console.log({ RegisterAuthDto });

    const code = CodeGenerator();
    await this.authService.create(RegisterAuthDto.phone, code);

    return this.responseHandler.send(res, HttpStatus.OK, "کد تایید ارسال شد.", {
      code,
    });
  }

  // Verify Code
  // ok response
  @ApiOkResponse({
    description: "کد ارسالی تایید شد. با موفقیت وارد شدید.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "کد ارسالی تایید شد. با موفقیت وارد شدید.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            next_step: {
              type: "string",
              example: "home, complete_registration",
            },
            client_info: {
              type: "object",
              properties: {
                id: { type: "integer", example: 1 },
                provider_id: { type: "integer", example: 1 },
                name: { type: "string" },
                surname: { type: "string" },
                phone: { type: "string" },
                user_name: { type: "string" },
                email: { type: "string" },
                avatar: { type: "string" },
                token: { type: "string" },
                user_key: { type: "string" },
                referral_code: { type: "string" },
                province: {
                  type: "object",
                  properties: {
                    id: { type: "number" },
                    name: { type: "string" },
                  },
                },
                city: {
                  type: "object",
                  properties: {
                    id: { type: "number" },
                    name: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
  })

  // created response
  @ApiCreatedResponse({
    description: "ثبت نام با موفقیت انجام شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 201 },
        message: {
          type: "string",
          example: "ثبت نام با موفقیت انجام شد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            next_step: {
              type: "string",
              example: "home, complete_registration",
            },
            client_info: {
              type: "object",
              properties: {
                id: { type: "integer", example: 1 },
                provider_id: { type: "integer", example: 1 },
                name: { type: "string" },
                surname: { type: "string" },
                phone: { type: "string" },
                user_name: { type: "string" },
                email: { type: "string" },
                avatar: { type: "string" },
                token: { type: "string" },
                user_key: { type: "string" },
                referral_code: { type: "string" },
                province: {
                  type: "object",
                  properties: {
                    id: { type: "number" },
                    name: { type: "string" },
                  },
                },
                city: {
                  type: "object",
                  properties: {
                    id: { type: "number" },
                    name: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
  })

  // BadRequest Response
  @ApiBadRequestResponse({
    type: BadRequestSchema,
    description:
      "خطا. درخواست به درستی ارسال نشده است. لطفا اطلاعات ارسالی را بررسی کنید.",
    schema: {
      $ref: getSchemaPath(BadRequestSchema),
    },
  })

  // NotFound Response
  @ApiNotFoundResponse({
    description: "خطا. آدرس موردنظر یافت نشد",
    type: NotFoundSchema,
    schema: {
      $ref: getSchemaPath(NotFoundSchema),
    },
  })

  // UnprocessableEntity Response
  @ApiUnprocessableEntityResponse({
    description:
      "خطا. مقادیر ارسالی اشتباه هستند. در فیلد مسیج مقادیر اشتباه قرار دارند.",
    type: UnProcessableEntitySchema,
    schema: {
      $ref: getSchemaPath(UnProcessableEntitySchema),
    },
  })

  // InternalServerError Response
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorSchema,
    description: "خطای سرور. لطفا کمی بعد تلاش کنید",
    schema: {
      $ref: getSchemaPath(InternalServerErrorSchema),
    },
  })
  @Post("/verify")
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: VerifyAuthDto })
  @FormDataRequest()
  async verify(@Body() verifyAuthDto: VerifyAuthDto, @Res() res: Response) {
    console.log("Verify Code");
    console.log({ Body });

    const result = await this.authService.verify(verifyAuthDto);

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. کد ارسالی صحیح نمیباشد.");
    }
    if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }
    const transformer = this.clientTransformer.transform(result.client);

    return this.responseHandler.send(res, result.status, result.message, {
      next_step: result.next_step,
      client_info: transformer,
    });
  }

  // TODO: TEST =>  Delete this
  @Get("addAllUserToDefaultChannel")
  async addAllUserToDefaultChannel(@Res() res: Response) {
    console.log("Verify addAllUserToDefaultChannel");

    await this.authService.addAllUserToDefaultChannel();

    return this.responseHandler.send(res, 200, "اضافه شدن");
  }
}
