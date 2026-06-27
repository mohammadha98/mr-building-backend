import {
  Controller,
  Get,
  Body,
  Patch,
  UseGuards,
  Request,
  Response,
  Query,
} from "@nestjs/common";
import { RealEstateAgentsAdvisorsService } from "./real-estate-agents-advisors.service";
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import { ForbiddenErrorHandler } from "src/modules/services/httpResponseHandler/forbiddenErrorHandler";
import { BadRequestErrorHandler } from "src/modules/services/httpResponseHandler/badRequestErrorHandler";
import { InternalServerErrorHandler } from "src/modules/services/httpResponseHandler/internalServerErrorHandler";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import ClientTransformer from "src/modules/v1/client/app/Transformer";
import { GetRealEstateAgentsAdvisorsDto } from "./dto/get-real-estate-agents-advisors.dto";
import RealEstateAdvisorTransformer from "./Transformer";
import { GetAdvisorCommentsDto } from "./dto/get-advisor-comments..dto";
import { ChangeStatusAdvisorsDto } from "./dto/change-status-real-estate-agents-advisors.dto";
import AdminTokenAuthGuard from "../../jwt-auth/AdminTokenAuthGuard";

@UseGuards(AdminTokenAuthGuard)
@ApiSecurity("JWT-auth")
@ApiTags("v1/admin/real-estate-agents-advisors")
@Controller("v1/admin/real-estate-agents-advisors")
export class RealEstateAgentsAdvisorsController {
  constructor(
    private readonly responseHandler: HttpResponsehandler,
    private readonly realEstateAdvisorTransformer: RealEstateAdvisorTransformer,
    private readonly clientTransformer: ClientTransformer,
    private readonly realEstateAgentsAdvisorsService: RealEstateAgentsAdvisorsService
  ) {}

  // دریافت لیست کارشناس های یک مشاور املاک
  @ApiOkResponse({
    description: "لیست کارشناس های کارشناس در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "لیست کارشناس های کارشناس در دسترس است.",
        },
        error: { type: "string" },
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              name: { type: "string" },
              phone: { type: "string" },
              validate_phone: { type: "boolean", default: false },
              avatar: { type: "string" },
              score: { type: "integer", example: 0 },
              biography: { type: "string" },
              comment_visibility: { type: "boolean" },
              number_of_ads: { type: "integer", example: 0 },
              total_customer: { type: "integer", example: 0 },
              status: { type: "string", example: "active, inactive" },
              agent_info: {
                type: "object",
                properties: {
                  id: { type: "integer", example: 1 },
                  name: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: "دریافت لیست کارشناس های یک مشاور املاک" })
  // @Get()
  async findAll(
    @Query() query: GetRealEstateAgentsAdvisorsDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    query.client_id = req.user.id;
    console.log("*** RealEstateAgentsAdvisor: findAll ***");
    console.log({ query });

    const result = await this.realEstateAgentsAdvisorsService.findAll(query);
    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. کارشناس درخواست موجود نمیباشد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    return this.responseHandler.send(
      res,
      200,
      "لیست کارشناس های کارشناس در دسترس است.",
      result.advisors
    );
  }

  //   تغییر وضعیت کامنت کارشناس
  @ApiOkResponse({
    description: "وضعیت کارشناس با موفقیت تغییر کرد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "وضعیت کارشناس با موفقیت تغییر کرد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {},
        },
      },
    },
  })
  @ApiOperation({ summary: "تغییر وضعیت کامنت کارشناس ها" })
  @Patch("comments")
  async changeStatus(
    @Body() body: ChangeStatusAdvisorsDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    console.log("*** RealEstateAgentsAdvisor Comment: change status ***");
    console.log(body);
    body.client_id = req.user.id;

    const result = await this.realEstateAgentsAdvisorsService.changeStatus(
      body
    );

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا . کارشناس مورد نظر موجود نمیباشد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    return this.responseHandler.send(
      res,
      200,
      "وضعیت کارشناس با موفقیت تغییر کرد."
    );
  }

  // لیست نظرات کارشناس
  @ApiOkResponse({
    description: "لیست نظرات ثبت شده در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "لیست نظرات ثبت شده در دسترس است.",
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
                  comment: { type: "String" },
                  score: { type: "number", example: 4 },
                  status: {
                    type: "string",
                    example: "pending, approved, rejected",
                  },
                  client: {
                    type: "object",
                    properties: {
                      id: { type: "integer" },
                      name: { type: "String" },
                    },
                  },
                  created_at: {
                    type: "object",
                    properties: {
                      day: { type: "integer" },
                      month: { type: "string" },
                      year: { type: "integer" },
                    },
                  },
                },
              },
            },
            statistics: {
              type: "object",
              properties: {
                total_comments: { type: "number", example: 1 },
                total_score: { type: "number", example: 2 },
              },
            },
            comment_submitted: { type: "boolean", example: true },
            user_comment: {
              type: "object",
              properties: {
                id: { type: "integer", example: "1" },
                agent_id: { type: "number", example: 1 },
                comment: { type: "String" },
                score: { type: "number", example: 4 },
                status: {
                  type: "string",
                  example: "pending, approved, rejected",
                },
                client: {
                  type: "object",
                  properties: {
                    id: { type: "integer" },
                    name: { type: "String" },
                  },
                },
                created_at: {
                  type: "object",
                  properties: {
                    day: { type: "integer" },
                    month: { type: "string" },
                    year: { type: "integer" },
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
  @ApiOperation({ summary: "لیست نظرات کارشناس ها" })
  @Get("comments")
  async findComments(
    @Query() query: GetAdvisorCommentsDto,
    @Request() req: any,
    @Response() res: any
  ) {
    query.user_id = req.user.id;
    console.log("*** Get Advisor Comments ***");
    console.log(query);
    const result = await this.realEstateAgentsAdvisorsService.findComments(
      query
    );
    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. آیتم موردنظر وجود ندارد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    // const transformer = this.realEstateAdvisorTransformer.collectionComments(
    //   result.result
    // );

    return this.responseHandler.send(
      res,
      200,
      "لیست نظرات ثبت شده در دسترس است.",
      {
        data: result.result,
        metadata: result.metadata,
      }
    );
  }
}
