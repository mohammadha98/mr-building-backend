import {
  Controller,
  Response,
  UseGuards,
  Get,
  Request,
  Query,
} from "@nestjs/common";

import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import { InternalServerErrorHandler } from "src/modules/services/httpResponseHandler/internalServerErrorHandler";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { DbBackupService } from "./dbBackup.service";
import BackupTransformer from "./Transformer";
import AdminTokenAuthGuard from "../jwt-auth/AdminTokenAuthGuard";
import { ForbiddenErrorHandler } from "src/modules/services/httpResponseHandler/forbiddenErrorHandler";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";

@UseGuards(AdminTokenAuthGuard)
@ApiSecurity("JWT-auth")
@ApiTags("v2/admin-backups")
@Controller("v2/admin/backups")
export class DbBackupController {
  constructor(
    private readonly backupsService: DbBackupService,
    private readonly backupTransFormer: BackupTransformer,
    private readonly responseHandler: HttpResponsehandler
  ) {}

  @ApiOperation({ summary: "ذخیره و دریافت بکاپ از دیتابیس" })
  @Get()
  async saveNewBackup() {
    console.log("saveNewBackup: ADMIN");

    return this.backupsService.saveBackup();
  }

  @ApiOperation({ summary: "بکاپ گیری از فایل ها" })
  @Get("file")
  async createZipPublicDir(@Response() res: Response, @Request() req: any) {
    const user_id = req.user.id;
    console.log("saveNewBackup: ADMIN");
    console.log({ user_id });

    const result = await this.backupsService.createZipPublicDir(user_id);
    console.log(result.status);

    if (result.status === 401) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    // const transformer = this.backupTransFormer.transform(result.result);
    return this.responseHandler.send(
      res,
      201,
      "عملیات با موفقیت انجلم شد."
      // transformer,
    );
  }

  @ApiOkResponse({
    description: "لیست بکاپ ها در دسترس است",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "لیست بکاپ ها در دسترس است",
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
                  id: { type: "string" },
                  link: { type: "string" },
                  created_at: { type: "object" },
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
  @ApiOperation({ summary: "لیست بکاپ ها" })
  @Get("/list")
  async getBackupList(
    @Query() qeury: PaginationDto,
    @Response() res: Response,
    @Request() req: any
  ) {
    qeury.user_id = req.user.id;
    console.log("getBackupList: ADMIN");
    console.log({ qeury });

    const result = await this.backupsService.getBackupList(qeury);
    console.log(result.status);

    if (result.status === 401) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    const transformer = this.backupTransFormer.collection(result.result);
    return this.responseHandler.send(res, 200, "لیست بکاپ ها در دسترس است", {
      data: transformer,
      metadata: result.metadata,
    });
  }
}
