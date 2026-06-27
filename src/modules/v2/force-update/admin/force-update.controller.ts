import {
  Delete,
  InternalServerErrorException,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Response,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { ForceUpdateService } from "./force-update.service";
import { CreateForceUpdateDto } from "./dto/create-forceupdate.dto";
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import { ForbiddenErrorHandler } from "src/modules/services/httpResponseHandler/forbiddenErrorHandler";
import RealEstateAgentsCommentsTransformer from "./Transformer";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { FormDataRequest } from "nestjs-form-data";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import { ChangeStatusDto } from "./dto/change-status.dto";
import { RemoveDto } from "./dto/remove.dto";
import { BadRequestErrorHandler } from "src/modules/services/httpResponseHandler/badRequestErrorHandler";
import { join, parse } from "path";
import { randomBytes } from "crypto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { CheckForceUpdateFileMiddleware } from "./check-file.middleware";
import AdminTokenAuthGuard from "../../jwt-auth/AdminTokenAuthGuard";

@UseGuards(AdminTokenAuthGuard)
@ApiSecurity("JWT-auth")
@ApiTags("v2/admin-force-update")
@Controller("v2/admin/force-update")
export class RealEstateAgentsCommentsController {
  constructor(
    private readonly responseHandler: HttpResponsehandler,
    private readonly agentsCommentsService: ForceUpdateService,
    private readonly agentsCommentsTransformer: RealEstateAgentsCommentsTransformer
  ) {}

  // ثبت آپدیت اجباری
  @ApiCreatedResponse({
    description: "آیتم جدید ذخیره شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 201 },
        message: {
          type: "string",
          example: "آیتم جدید ذخیره شد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {},
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor("file_apk", {
      storage: diskStorage({
        destination: "./public/contents/force_updates",
        filename(req, file, callback) {
          const uniqueCode = randomBytes(3).toString("hex").toUpperCase();
          const extention = parse(join(file.originalname)).ext;
          callback(null, `${Date.now()}-${uniqueCode}${extention}`);
        },
      }),
    }),
    CheckForceUpdateFileMiddleware
  )
  @ApiOperation({ summary: " آپدیت اجباری" })
  // @FormDataRequest()
  @ApiBody({ type: CreateForceUpdateDto })
  @ApiConsumes("multipart/form-data")
  @Post()
  async storeForceUpdate(
    @Body() body: CreateForceUpdateDto,
    @UploadedFile() file_apk: Express.Multer.File,
    @Request() req: any,
    @Response() res: any
  ) {
    body.user_id = req.user.id;
    body.file_apk = file_apk ? file_apk.filename : null;
    const result = await this.agentsCommentsService.storeForceUpdate(body);
    const transformer = this.agentsCommentsTransformer.transform(result.result);

    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorException();
    }

    return this.responseHandler.send(res, 201, "آیتم جدید ذخیره شد.", {
      data: transformer,
      total_clients: result.total_clients,
    });
  }

  // لیست بروزرسانی های ثبت شده
  @ApiOkResponse({
    description: "لیست بروزرسانی های ثبت شده در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "لیست بروزرسانی های ثبت شده در دسترس است.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                properties: {
                  id: { type: "integer", example: "1" },
                  version: { type: "String", example: "1.0.5" },
                  required: { type: "boolean", example: true },
                  file_name: { type: "String" },
                  file_url: { type: "String" },
                  total_clients: { type: "number" },
                  status: {
                    type: "string",
                    example: "active, inactive",
                  },
                  items: {
                    type: "array",
                    items: {
                      type: "string",
                      properties: {},
                    },
                  },
                  created_at: { type: "String", example: "" },
                },
              },
            },
            total_installs: { type: "number" },
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
  @ApiOperation({ summary: "لیست بروزرسانی های ثبت شده" })
  @Get()
  async findAllComments(
    @Query() query: PaginationDto,
    @Request() req: any,
    @Response() res: any
  ) {
    query.user_id = req.user.id;
    const result = await this.agentsCommentsService.findAll(query);

    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorException();
    }

    const transformer = this.agentsCommentsTransformer.collection(
      result.result
    );

    return this.responseHandler.send(
      res,
      200,
      "لیست بروزرسانی های ثبت شده در دسترس است.",
      {
        data: transformer,
        total_clients: result.total_clients,
        metadata: result.metadata,
      }
    );
  }

  // تغییر وضعیت
  @ApiCreatedResponse({
    description: "تغییر وضعیت انجام شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 201 },
        message: {
          type: "string",
          example: "تغییر وضعیت انجام شد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            data: {},
          },
        },
      },
    },
  })
  @ApiOperation({ summary: "تغییر وضعیت" })
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  // @Post("change_status")
  async changeStatus(
    @Body() body: ChangeStatusDto,
    @Request() req: any,
    @Response() res: any
  ) {
    body.user_id = req.user.id;
    const result = await this.agentsCommentsService.changeStatus(body);

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. آیتم موردنظر موجود نمیباشد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorException();
    }

    return this.responseHandler.send(res, 201, "تغییر وضعیت انجام شد.");
  }

  @ApiOkResponse({
    description: "حذف آیتم با موفقیت انجام شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "حذف آیتم با موفقیت انجام شد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            data: {},
          },
        },
      },
    },
  })
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  @Delete()
  async remove(
    @Query() query: RemoveDto,
    @Request() req: any,
    @Response() res: any
  ) {
    query.user_id = req.user.id;
    const result = await this.agentsCommentsService.remove(query);

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. آیتم موردنظر موجود نمیباشد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorException();
    }

    return this.responseHandler.send(res, 200, "حذف آیتم با موفقیت انجام شد.");
  }
}
