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
  Query,
} from "@nestjs/common";
import { MissionsAdminService } from "./missions.service";
import { CreateMissionDto } from "./dto/create-mission.dto";
import {
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import MissionsTransformer from "./transformer";
import { FormDataRequest } from "nestjs-form-data";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import { ChangeStatusMissionDto } from "./dto/change-status-mission.dto";
import AdminTokenAuthGuard from "../../jwt-auth/AdminTokenAuthGuard";

@UseGuards(AdminTokenAuthGuard)
@ApiSecurity("JWT-auth")
@Controller("v2/admin/missions")
@ApiTags("v2/admin-missions")
export class MissionsController {
  constructor(
    private readonly missionsService: MissionsAdminService,
    private readonly responseHandler: HttpResponsehandler,
    private readonly missionsTransformer: MissionsTransformer
  ) {}

  // ایجاد ماموریت
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
            status: {
              type: "string",
              example: "active, inactive",
            },
            number_of_used: { type: "integer", example: 0 },
            created_at: { type: "string" },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: "ایجاد ماموریت" })
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  @Post()
  async create(
    @Body() body: CreateMissionDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.user_id = req.user.id;

    console.log("*** Create New Mission ***");
    console.log(body);
    const result = await this.missionsService.create(body);

    const transformer = this.missionsTransformer.transform(result.retsult.data);

    return this.responseHandler.send(
      res,
      result.retsult.status,
      result.retsult.message,
      transformer
    );
  }

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
            status: {
              type: "string",
              example: "active, inactive",
            },
            number_of_used: { type: "integer", example: 0 },
            created_at: { type: "string" },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: "تست - بروزرسانی ماموریت های کلاینت های ثبت شده" })
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  // @Post('update-test')
  async updateClientMissions(@Request() req: any, @Response() res: Response) {
    console.log("*** Update Client Mission: ADMIN ***");
    console.log(req.user.id);
    await this.missionsService.updateClientMissions(req.user.id);

    return this.responseHandler.send(res, 201, "درخواست با موفقیت انجام شد.");
  }

  @ApiOkResponse({
    description: "لیست ماموریت ها در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "لیست ماموریت ها در دسترس است.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            missions: {
              type: "array",
              items: {
                properties: {
                  id: { type: "integer", example: 1 },
                  title: { type: "string" },
                  description: { type: "string" },
                  key: { type: "string" },
                  point: { type: "integer", example: 1 },
                  status: { type: "string" },
                  created_at: { type: "string" },
                  number_of_used: { type: "integer", example: 1 },
                  is_daily: { type: "boolean" },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: "دریافت ماموریت ها" })
  @Get("")
  async getMissions(
    @Query() query: PaginationDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    query.user_id = req.user.id;

    console.log("*** Get Missions: APP ***");
    console.log(query);
    const result = await this.missionsService.getMissions(query);

    const transformer = this.missionsTransformer.collection(result);

    return this.responseHandler.send(
      res,
      200,
      "لیست ماموریت ها در دسترس است.",
      {
        missions: transformer,
      }
    );
  }

  @ApiOkResponse({
    description: "وضعیت با موفقیت تغییر کرد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "وضعیت با موفقیت تغییر کرد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {},
        },
      },
    },
  })
  @ApiOperation({ summary: "تغییر وضعیت ماموریت" })
  @Post("/change-status")
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  async changeStatus(
    @Body() body: ChangeStatusMissionDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.user_id = req.user.id;

    console.log("*** ChangeStatus Mission: ADMIN ***");
    console.log(body);
    await this.missionsService.changeStatus(body);

    return this.responseHandler.send(res, 200, "وضعیت با موفقیت تغییر کرد.");
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
  async deleteMission(
    @Param("item_id") item_id: number,
    @Request() req: any,
    @Response() res: Response
  ) {
    const body = { user_id: req.user.id, item_id: item_id };

    console.log("*** Delete Mission: ADMIN ***");
    console.log(body);
    await this.missionsService.deleteMission(body);

    return this.responseHandler.send(res, 200, "عملیات با موفقیت انجام شد.");
  }
}
