import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Response,
  Query,
  NotFoundException,
} from "@nestjs/common";
import { PrizesService } from "./prizes.service";
import {
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/modules/v2/jwt-auth/jwt-auth.guard";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import PrizesTransformer from "./transformer";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import { UsePrizeDto } from "./dto/use-prize.dto";
import { FormDataRequest } from "nestjs-form-data";
import { BadRequestErrorHandler } from "src/modules/services/httpResponseHandler/badRequestErrorHandler";
import { ConflictErrorHandler } from "src/modules/services/httpResponseHandler/conflictErrorHandler";

@Controller("v2/app/prizes")
@ApiTags("v2/app-prizes")
@UseGuards(JwtAuthGuard)
@ApiSecurity("JWT-auth")
export class PrizesController {
  constructor(
    private readonly prizesService: PrizesService,
    private readonly responseHandler: HttpResponsehandler,
    private readonly prizesTransformer: PrizesTransformer
  ) {}

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
            total_score: { type: "integer", example: 50 },
            missions: {
              type: "array",
              items: {
                properties: {
                  id: { type: "integer", example: 1 },
                  title: { type: "string" },
                  description: { type: "string" },
                  point: { type: "integer", example: 1 },
                  mission_done: { type: "boolean", default: false },
                  is_limited: { type: "boolean" },
                  number_of_hours: { type: "integer", example: 1 },
                  is_permitted: { type: "boolean" },
                  last_used_at: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: "دریافت ماموریت ها" })
  @Get("/missions")
  async getMissions(
    @Query() query: PaginationDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    query.user_id = req.user.id;

    console.log("*** Get Missions: APP ***");
    console.log(query);
    const result = await this.prizesService.getMissions(query);

    const transformer = this.prizesTransformer.missionCollection(
      result.result.missions
    );

    return this.responseHandler.send(
      res,
      200,
      "لیست ماموریت ها در دسترس است.",
      {
        total_score: result.result.total_score,
        missions: transformer,
      }
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
            total_score: { type: "integer", example: 50 },
            prizes: {
              type: "array",
              items: {
                properties: {
                  id: { type: "integer", example: 1 },
                  title: { type: "string" },
                  description: { type: "string" },
                  point: { type: "integer", example: 1 },
                  thumbnail: { type: "string" },
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
  @Get("/prizes")
  async getPrizes(
    @Query() query: PaginationDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    query.user_id = req.user.id;

    console.log("*** Get Prizes: APP ***");
    console.log(query);
    const result = await this.prizesService.getPrizes(query);

    const transformer = this.prizesTransformer.collection(result.result.prizes);

    return this.responseHandler.send(res, 200, "لیست جوایز در دسترس است.", {
      total_score: result.result.total_score,
      prizes: transformer,
      metadata: result.result.metadata,
    });
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
            total_score: { type: "integer", example: 50 },
            prizes: {
              type: "array",
              items: {
                properties: {
                  id: { type: "integer", example: 1 },
                  title: { type: "string" },
                  description: { type: "string" },
                  point: { type: "integer", example: 1 },
                  coupon: { type: "string" },
                  thumbnail: { type: "string" },
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
  @ApiOperation({ summary: "لیست جوایز کاربر " })
  @Get("/prizes/user")
  async getUserPrizes(
    @Query() query: PaginationDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    query.user_id = req.user.id;

    console.log("*** Get User Prizes: APP ***");
    console.log(query);
    const result = await this.prizesService.getUserPrizes(query);

    const transformer = this.prizesTransformer.collection(result.result.prizes);

    return this.responseHandler.send(res, 200, "لیست جوایز در دسترس است.", {
      total_score: result.result.total_score,
      prizes: transformer,
      metadata: result.result.metadata,
    });
  }

  @ApiOkResponse({
    description: "جایزه با موفقیت ثبت شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "جایزه با موفقیت ثبت شد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            total_score: { type: "integer", example: 50 },
            id: { type: "integer", example: 1 },
            coupon: { type: "string" },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: "دریافت جایزه" })
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  @Post("/prizes")
  async usePrize(
    @Body() body: UsePrizeDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.client_id = req.user.id;

    console.log("*** Use Prize: APP ***");
    console.log(body);
    const result = await this.prizesService.usePrize(body);

    if (result.status === 400) {
      throw new BadRequestErrorHandler("ظرفیت کدهای تخفیف به اتمام رسیده است.");
    } else if (result.status === 404) {
      throw new NotFoundException("خطا. جایزه موردنظر قابل استفاده نمیباشد. .");
    } else if (result.status === 409) {
      throw new ConflictErrorHandler("خطا. امتیاز شما کمتر از حد مجاز میباشد");
    }

    return this.responseHandler.send(res, 200, "جایزه با موفقیت ثبت شد.", {
      total_score: result.total_score,
      id: result.id,
      coupon: result.coupon,
    });
  }

  @ApiOkResponse({
    description: "لیست امتیاز ها در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "لیست امتیاز ها در دسترس است.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            total_score: { type: "integer", example: 50 },
            prizes: {
              type: "array",
              items: {
                properties: {
                  id: { type: "integer", example: 1 },
                  title: { type: "string" },
                  score: { type: "integer", example: 1 },
                  action: { type: "string", example: "increase, decrease" },
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
  @ApiOperation({ summary: "تاریخچه امتیازات " })
  @Get("/prizes/history")
  async getHistoryOfScores(
    @Query() query: PaginationDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    query.user_id = req.user.id;

    console.log("*** Get HistoryOfScores: APP ***");
    console.log(query);
    const result = await this.prizesService.getHistoryOfScores(query);

    const transformer = this.prizesTransformer.historyOfScorCollection(
      result.result.history
    );

    return this.responseHandler.send(
      res,
      200,
      "لیست امتیاز ها  در دسترس است.",
      {
        total_score: result.result.total_score,
        prizes: transformer,
        metadata: result.result.metadata,
      }
    );
  }
}
