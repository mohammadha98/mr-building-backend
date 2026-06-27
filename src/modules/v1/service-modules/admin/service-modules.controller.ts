import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Response,
  UseInterceptors,
  UploadedFile,
  Query,
} from "@nestjs/common";
import { ServiceModulesService } from "./service-modules.service";
import { CreateServiceMediaDto } from "./dto/create-service-media-module.dto";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import AdminTokenAuthGuard from "src/modules/v1/jwt-auth/AdminTokenAuthGuard";
import { FormDataRequest } from "nestjs-form-data";
import { FileInterceptor } from "@nestjs/platform-express";
import { Multer, diskStorage } from "multer";
import { randomBytes } from "crypto";
import { join, parse } from "path";
import { InternalServerErrorHandler } from "src/modules/services/httpResponseHandler/internalServerErrorHandler";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import ServicesModuleAdminTransformer from "./Transformer";
import { GetServicesMediaDto } from "./dto/get-service-media-module.dto";
import { BadRequestErrorHandler } from "src/modules/services/httpResponseHandler/badRequestErrorHandler";
import { CreateServiceDto } from "./dto/create-service.dto";

@UseGuards(AdminTokenAuthGuard)
@ApiSecurity("JWT-auth")
@ApiTags("v1/admin/services-module")
@Controller("v1/admin/services-module")
export class ServiceModulesController {
  private readonly httpResponsehandler: HttpResponsehandler;
  constructor(
    private readonly serviceModulesService: ServiceModulesService,
    private readonly transformer: ServicesModuleAdminTransformer
  ) {
    this.httpResponsehandler = new HttpResponsehandler();
  }

  @ApiCreatedResponse({
    description: "درخواست با موفقیت انجام شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 201 },
        message: {
          type: "string",
          example: "درخواست با موفقیت انجام شد.",
        },
        error: { type: "string", example: "" },
        data: {
          type: "object",
          properties: {
            id: { type: "string" },
            description: { type: "string" },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: "ذخیره مشخصات خدمات" })
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  @Post()
  async saveServiceInfo(
    @Body() body: CreateServiceDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.user_id = req.user.id;

    console.log("****** save service info ******");
    console.log({ body });

    const result = await this.serviceModulesService.saveServiceInfo(body);
    if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }
    const transformer = this.transformer.transformerService(result.result);
    return this.httpResponsehandler.send(
      res,
      201,
      "درخواست با موفقیت انجام شد.",
      transformer
    );
  }
  @ApiCreatedResponse({
    description: "فایل با موفقیت ذخیره شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 201 },
        message: {
          type: "string",
          example: "فایل با موفقیت ذخیره شد.",
        },
        error: { type: "string", example: "" },
        data: {
          type: "object",
          properties: {
            id: { type: "string" },
            type: { type: "string" },

            file_type: { type: "string" },
            file: { type: "string" },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: "ذخیره مدیا برای سرویس" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: CreateServiceMediaDto })
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./public/contents/temp/services/",
        filename(req, file, callback) {
          const uniqueCode = randomBytes(3).toString("hex").toUpperCase();
          const extention = parse(join(file.originalname)).ext;
          callback(null, `${Date.now()}-${uniqueCode}${extention}`);
        },
      }),
    })
  )
  @Post("/media")
  async saveNewMedia(
    @Body() body: CreateServiceMediaDto,
    @Request() req: any,
    @Response() res: Response,
    @UploadedFile() file: Express.Multer.File
  ) {
    body.user_id = req.user.id;
    body.file = file.filename;

    console.log("****** save new media in service module ******");
    console.log({ body });

    const result = await this.serviceModulesService.create(body);
    if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }
    const transformer = this.transformer.transformerMedia(result.result);
    return this.httpResponsehandler.send(
      res,
      201,
      "فایل با موفقیت ذخیره شد.",
      transformer
    );
  }

  @ApiOkResponse({
    description: "لیست فایل های خدمات در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 200 },
        message: {
          type: "string",
          example: "لیست فایل های خدمات در دسترس است.",
        },
        error: { type: "string", example: "" },
        data: {
          type: "object",
          properties: {
            info: {
              type: "object",
              properties: {
                id: { type: "string" },
                description: { type: "string" },
              },
            },
            list: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  type: { type: "string" },
                  file_type: { type: "string" },
                  file: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: "دریافت مدیاهای بخش خدمات" })
  @Get("/media")
  async findAll(
    @Query() query: GetServicesMediaDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    console.log("****** get serviceMedia module ******");
    console.log({ query });

    const result = await this.serviceModulesService.findAll(query);
    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. آیتم موردنظر وجود ندارد.");
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }
    const serviceInfo = this.transformer.transformerService(
      result.service.info
    );
    const media = this.transformer.collectionMedia(result.service.media);
    return this.httpResponsehandler.send(
      res,
      200,
      "لیست فایل های خدمات در دسترس است.",
      {
        info: serviceInfo,
        list: media,
      }
    );
  }

  @ApiOkResponse({
    description: "ایتم موردنظر حذف شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 200 },
        message: {
          type: "string",
          example: "ایتم موردنظر حذف شد.",
        },
        error: { type: "string", example: "" },
        data: {
          type: "object",
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: "خطا. آیتم موردنظر وجود ندارد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 400 },
        message: {
          type: "string",
          example: "خطا. آیتم موردنظر وجود ندارد.",
        },
        error: { type: "string", example: "" },
        data: {
          type: "object",
        },
      },
    },
  })
  @ApiOperation({ summary: "حذف فایل" })
  @Delete("media/:id")
  async remove(
    @Param("id") id: string,
    @Request() req: any,
    @Response() res: Response
  ) {
    console.log("****** remove Media in service module ******");
    console.log({ id });

    const result = await this.serviceModulesService.remove(id);
    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. آیتم موردنظر وجود ندارد.");
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }
    return this.httpResponsehandler.send(res, 200, "ایتم موردنظر حذف شد.");
  }
}
