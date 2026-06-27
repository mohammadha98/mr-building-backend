import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Response,
  UseInterceptors,
  UploadedFile,
  Query,
} from "@nestjs/common";
import { PrizesService } from "./prizes.service";
import { CreatePrizeDto } from "./dto/create-mission.dto";
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import PrizesTransformer from "./transformer";
import { FormDataRequest } from "nestjs-form-data";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { join, parse } from "path";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import { ChangeStatusMissionDto } from "src/modules/v2/missions/admin/dto/change-status-mission.dto";
import AdminTokenAuthGuard from "../../jwt-auth/AdminTokenAuthGuard";
import { CheckFileMiddleware } from "src/middlewares/check-file.middleware";

@UseGuards(AdminTokenAuthGuard)
@ApiSecurity("JWT-auth")
@Controller("v2/admin/prizes")
@ApiTags("v2/admin-prizes")
export class PrizesController {
  constructor(
    private readonly prizesService: PrizesService,
    private readonly responseHandler: HttpResponsehandler,
    private readonly prizesTransformer: PrizesTransformer
  ) {}

  @ApiCreatedResponse({
    description: "درخواست با موفقیت ثبت شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 201 },
        message: {
          type: "string",
          example: "درخواست با موفقیت ثبت شد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            title: { type: "string" },
            description: { type: "string" },
            point: { type: "integer", example: 1 },
            thumbnail: { type: "string" },
            coupon: { type: "string" },
            duration_days: { type: "integer", example: 0 },
            number_of_used: { type: "integer", example: 0 },
            status: {
              type: "string",
              example: "active, inactive",
            },
            created_at: { type: "string" },
            expired_at: { type: "string" },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: "ایجاد جایزه جدید" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: CreatePrizeDto })
  @UseInterceptors(
    FileInterceptor("thumbnail", {
      storage: diskStorage({
        destination: "./public/contents/prizes",
        filename(req, file, callback) {
          const extention = parse(join(file.originalname)).ext;
          callback(null, `${Date.now()}${extention}`);
        },
      }),
    }),
    CheckFileMiddleware
  )
  @Post()
  async create(
    @Body() body: CreatePrizeDto,
    @Request() req: any,
    @Response() res: Response,
    @UploadedFile() thumbnail: Express.Multer.File
  ) {
    body.user_id = req.user.id;
    body.thumbnail = thumbnail ? thumbnail.filename : null;

    console.log("*** Create New Pirzes ***");
    console.log(body);
    const result = await this.prizesService.create(body);

    /*     if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }
 */

    const transformer = this.prizesTransformer.transform(result);

    return this.responseHandler.send(
      res,
      201,
      "درخواست با موفقیت ثبت شد.",
      transformer
    );
  }

  @ApiOkResponse({
    description: "لیست جوایز در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "لیست جوایز در دسترس است.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            prizes: {
              type: "array",
              items: {
                properties: {
                  id: { type: "integer", example: 1 },
                  title: { type: "string" },
                  description: { type: "string" },
                  point: { type: "integer", example: 1 },
                  thumbnail: { type: "string" },
                  coupon: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "integer", example: 1 },
                        coupon: { type: "string" },
                        status: { type: "string", example: "active, used" },
                      },
                    },
                  },
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
  @ApiOperation({ summary: "لیست جوایز " })
  @Get()
  async getPrizes(
    @Query() query: PaginationDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    query.user_id = req.user.id;

    console.log("*** Get Prizes: APP ***");
    console.log(query);
    const result = await this.prizesService.getPrizes(query);

    const transformer = this.prizesTransformer.collection(result.prizes);

    return this.responseHandler.send(res, 200, "لیست جوایز در دسترس است.", {
      prizes: transformer,
      metadata: result.metadata,
    });
  }

  @ApiOkResponse({
    description: "تغییر وضعیت با موفقیت انجام شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "تغییر وضعیت با موفقیت انجام شد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {},
        },
      },
    },
  })
  @ApiOperation({ summary: "تغییر وضعیت جایزه " })
  @Post("/change-status")
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  async changeStatus(
    @Body() body: ChangeStatusMissionDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.user_id = req.user.id;

    console.log("*** Chane Status Prize: ADMIN ***");
    console.log(body);
    await this.prizesService.changeStatus(body);

    return this.responseHandler.send(
      res,
      200,
      "تغییر وضعیت با موفقیت انجام شد."
    );
  }

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
  @ApiOperation({ summary: "حذف ماموریت" })
  @Delete("/:item_id")
  async deletePrize(
    @Param("item_id") item_id: number,
    @Request() req: any,
    @Response() res: Response
  ) {
    const body = { user_id: req.user.id, item_id: item_id };

    console.log("*** Delete Prize: ADMIN ***");
    console.log(body);
    await this.prizesService.deletePrize(body);

    return this.responseHandler.send(res, 200, "عملیات با موفقیت انجام شد.");
  }
}
