import {
  Controller,
  Get,
  Body,
  Patch,
  Res,
  Request,
  Response,
  UseGuards,
  Param,
  Post,
  UseInterceptors,
  UploadedFile,
  Query,
  ParseFilePipe,
} from "@nestjs/common";
import { ClientService } from "./client.service";
import { UpdateClientDto } from "./dto/update-client.dto";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { JwtAuthGuard } from "src/modules/v2//jwt-auth/jwt-auth.guard";
import ClientTransformer from "./Transformer";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
  getSchemaPath,
} from "@nestjs/swagger";

import UnAuthorizedSchema from "src/commons/contracts/swaggerDefinations/UnAuthorizedSchema";
import BadRequestSchema from "src/commons/contracts/swaggerDefinations/BadRequestSchema";
import InternalServerErrorSchema from "src/commons/contracts/swaggerDefinations/InternalServerErrorSchema";
import UnProcessableEntitySchema from "src/commons/contracts/swaggerDefinations/UnProcessableEntitySchema";
import NotFoundSchema from "src/commons/contracts/swaggerDefinations/NotFoundSchema";
import { ForbiddenErrorHandler } from "src/modules/services/httpResponseHandler/forbiddenErrorHandler";
import ForbiddenSchema from "src/commons/contracts/swaggerDefinations/ForbiddenSchema";
import { FormDataRequest } from "nestjs-form-data";
import { InternalServerErrorHandler } from "src/modules/services/httpResponseHandler/internalServerErrorHandler";
import { join, parse } from "path";
import { DisableUpdateStatus } from "./dto/disbale-update-status";
import { SaveGifClientDto } from "./dto/save-gif-client.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { randomBytes } from "crypto";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import InstalledVersionTypes from "src/commons/contracts/InstalledVersionTypes";
import { UpdateClienProfiletDto } from "./dto/update-profile.dto";
import { CheckFileMiddleware } from "src/middlewares/check-file.middleware";

@UseGuards(JwtAuthGuard)
@ApiSecurity("JWT-auth")
@ApiTags("v2/client")
@Controller("v2/client")
export class ClientController {
  private responsehandler: HttpResponsehandler;
  constructor(
    private readonly clientService: ClientService,
    private readonly clientTransformer: ClientTransformer
  ) {
    this.responsehandler = new HttpResponsehandler();
  }

  // get client profile
  @Get()
  @ApiOperation({
    summary: "دریافت اطلاعات پروفایل کاربر",
    description:
      " اگر کلاینت درخواست مشاور شدن ثبت نکرده باشد  فیلد   \n \n  estate_agent_info \n \n برابر \n \n null \n \n میباشد و در صورتیکه درخواست ثبت شده باشد بر اساس مدل مشخص شده در ریسپانس دریافت میشود",
  })
  @ApiConsumes("multipart/form-data")
  // ok response
  @ApiOkResponse({
    description: "دریافت اطلاعات پروفایل کاربر با موفقیت انجام شد",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "دریافت اطلاعات پروفایل کاربر با موفقیت انجام شد",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            provider_id: { type: "integer", example: 1 },
            name: { type: "string" },
            surname: { type: "string" },
            phone: { type: "string" },
            user_name: { type: "string" },
            email: { type: "string" },
            has_update: { type: "boolean", example: false },
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
  // Unauthorized Response
  @ApiUnauthorizedResponse({
    description: "خطا. احزار هویت انجام نشده است",
    type: UnAuthorizedSchema,
    schema: {
      $ref: getSchemaPath(UnAuthorizedSchema),
    },
  })
  // Forbidden Response
  @ApiForbiddenResponse({
    description: "خطا. اجازه ادامه کار را ندارید.",
    type: ForbiddenSchema,
    schema: {
      $ref: getSchemaPath(ForbiddenSchema),
    },
  })
  // UnprocessableEntity Response
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
  async clientInfo(@Request() req: any, @Res() res: Response) {
    console.log("*** Client info ***");
    const result = await this.clientService.clientInfo(req.user.id);

    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    const clientTransformer = this.clientTransformer.transform(
      result.client_info
    );

    // TODO: log for client info
    console.log(clientTransformer.phone);

    return this.responsehandler.send(
      res,
      200,
      "اطلاعات پروفایل کاربر در دسترس است.",
      clientTransformer
    );
  }

  // disable_update
  @ApiOkResponse({
    description: "عملیات با موفقیت انجام شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "عملیات با موفقیت انجام شد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {},
        },
      },
    },
  })
  @ApiOperation({ summary: "تغییر وضعیت آپدیت کلاینت" })
  @Patch("disable_update/:item_id")
  async disableUpdateStatus(
    @Param("item_id") item_id: number,
    @Request() req: any,
    @Response() res: Response
  ) {
    const query = {
      client_id: req.user.id,
      item_id: Number(item_id),
      installed_version_type: InstalledVersionTypes.direct,
    };

    console.log("*** disable_update ***");
    console.log(query);

    await this.clientService.disableUpdateStatus(query);
    return this.responsehandler.send(res, 200, "عملیات با موفقیت انجام شد.");
  }

  // New: disable_update
  @ApiOkResponse({
    description: "عملیات با موفقیت انجام شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "عملیات با موفقیت انجام شد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {},
        },
      },
    },
  })
  @ApiOperation({ summary: "تغییر وضعیت آپدیت کلاینت - اصلی" })
  @Patch("disable_update_main")
  async disableUpdateStatusMain(
    @Query() query: DisableUpdateStatus,
    @Request() req: any,
    @Response() res: Response
  ) {
    query.client_id = req.user.id;

    console.log("*** disable_update: Main ***");
    console.log(query);

    await this.clientService.disableUpdateStatus(query);
    return this.responsehandler.send(res, 200, "عملیات با موفقیت انجام شد.");
  }

  // complete registration
  @ApiOkResponse({
    description: "تکمیل ثبت نام با موفقیت انجام شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "تکمیل ثبت نام با موفقیت انجام شد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            provider_id: { type: "integer", example: 1 },
            name: { type: "string" },
            surname: { type: "string" },
            phone: { type: "string" },
            user_name: { type: "string" },
            email: { type: "string" },
            has_update: { type: "boolean", example: false },
            avatar: { type: "string" },
            token: { type: "string" },
            user_key: { type: "string" },
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
  })
  @Patch()
  @ApiOperation({ summary: "تکمیل ثبت نام" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: UpdateClientDto })
  @FormDataRequest()
  async update(
    @Body() updateClientDto: UpdateClientDto,
    @Request() request: any,
    @Response() response: any
  ) {
    updateClientDto.id = request.user.id;
    const result = await this.clientService.update(updateClientDto);
    if (!result) {
      throw new InternalServerErrorHandler();
    }

    const transformer = this.clientTransformer.transform(result.client);
    return this.responsehandler.send(
      response,
      200,
      "تکمیل ثبت نام با موفقیت انجام شد.",
      transformer
    );
  }

  // update client profile
  @ApiOkResponse({
    description: "بروزرسانی پروفایل با موفقیت انجام شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "بروزرسانی پروفایل با موفقیت انجام شد.",
        },
        error: { type: "string" },
        data: {
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
  })
  @Patch("profile")
  @ApiOperation({ summary: "بروزرسانی پروفایل" })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(
    FileInterceptor("avatar", {
      storage: diskStorage({
        destination: "./public/contents/clients/avatars",
        filename(req, file, callback) {
          console.log({ file });
          const uniqueCode = randomBytes(3).toString("hex").toUpperCase();
          const extention = parse(join(file.originalname)).ext;
          callback(null, `${Date.now()}-${uniqueCode}${extention}`);
        },
      }),
    }),
    CheckFileMiddleware
  )
  @ApiBody({ type: UpdateClienProfiletDto })
  async updateClienProfile(
    @Body() body: UpdateClienProfiletDto,
    @Request() request: any,
    @Response() response: any,
    @UploadedFile(new ParseFilePipe({ fileIsRequired: false }))
    file: Express.Multer.File
  ) {
    console.log({ file });

    body.client_id = request.user.id;
    body.avatar = file ? file.filename : null;

    // TODO: test log
    console.log("*** updateClienProfile ***");
    console.log(body);

    const result = await this.clientService.updateClienProfile(body);
    if (!result) {
      throw new InternalServerErrorHandler();
    }

    const transformer = this.clientTransformer.transform(result.client);
    return this.responsehandler.send(
      response,
      200,
      "بروزرسانی پروفایل با موفقیت انجام شد.",
      transformer
    );
  }

  // save new Gif
  @ApiCreatedResponse({
    description: "گیف موردنظر با موفقیت ذخیره شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 201 },
        message: {
          type: "string",
          example: "گیف موردنظر با موفقیت ذخیره شد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./public/contents/temp/gif/",
        filename(req, file, callback) {
          const uniqueCode = randomBytes(8).toString("hex").toLocaleUpperCase();
          const extension = parse(join(file.originalname)).ext;
          callback(null, `${uniqueCode}${extension}`);
        },
      }),
    })
  )
  @Post("gif")
  @ApiOperation({ summary: "ذخیره گیف" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: SaveGifClientDto })
  async saveGif(
    @Body() body: SaveGifClientDto,
    @Request() request: any,
    @Response() response: any,
    @UploadedFile() file: Express.Multer.File
  ) {
    body.client_id = request.user.id;
    body.file = file.filename;

    // TODO: log for Global Uploader
    console.log("*** Save Gif ***");
    console.log(body);

    const result = await this.clientService.saveGif(body);
    if (!result) {
      throw new InternalServerErrorHandler();
    }

    const transformer = this.clientTransformer.gifTransformer(result.result);

    return this.responsehandler.send(
      response,
      201,
      "گیف موردنظر با موفقیت ذخیره شد.",
      transformer
    );
  }

  @ApiOkResponse({
    description: "لیست گیف های کاربر در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "لیست گیف های کاربر در دسترس است.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "integer", example: 1 },
                  file: { type: "string" },
                },
              },
            },
            metadata: {
              type: "object",
              properties: {
                page: { type: "integer", example: 1 },
                total_page: { type: "integer", example: 1 },
                per_page: { type: "integer", example: 1 },
                next: { type: "boolean", example: true },
                back: { type: "boolean", example: false },
              },
            },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: "لیست گیف های من" })
  @Get("gif")
  async findMyChats(
    @Query() query: PaginationDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    query.user_id = req.user.id;

    console.log("*** Get Client Gifs ***");
    console.log(query);

    const result = await this.clientService.getClientGifList(query);

    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    const transformer = this.clientTransformer.gifCollection(result.result);

    return this.responsehandler.send(
      res,
      200,
      "لیست گیف های کاربر در دسترس است.",
      {
        data: transformer,
        metadata: result.metadata,
      }
    );
  }
}
