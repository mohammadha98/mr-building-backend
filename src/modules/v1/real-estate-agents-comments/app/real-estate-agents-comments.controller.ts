import { InternalServerErrorException, Query, UseGuards } from "@nestjs/common";
import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Request,
  Response,
} from "@nestjs/common";
import { RealEstateAgentsCommentsService } from "./real-estate-agents-comments.service";
import { CreateRealEstateAgentsCommentDto } from "./dto/create-real-estate-agents-comment.dto";
import { JwtAuthGuard } from "src/modules/v1/jwt-auth/jwt-auth.guard";
import {
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
import { GetCommentsListForRealEstateAgentDto } from "src/modules/v1/real-estate-agents/app/dto/get-list..dto";
import { BadRequestErrorHandler } from "src/modules/services/httpResponseHandler/badRequestErrorHandler";
import { DeleteCommentDto } from "./dto/update-real-estate-agents-comment.dto";

@UseGuards(JwtAuthGuard)
@ApiSecurity("JWT-auth")
@ApiTags("v1/app-real-estate-agents-comments")
@Controller("v1/app/real-estate-agents-comments")
export class RealEstateAgentsCommentsController {
  constructor(
    private readonly responseHandler: HttpResponsehandler,
    private readonly agentsCommentsService: RealEstateAgentsCommentsService,
    private readonly agentsCommentsTransformer: RealEstateAgentsCommentsTransformer
  ) {}

  // ثبت نظر
  @ApiOkResponse({
    description: "نظر شما در سیستم موجود میباشد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "نظر شما در سیستم موجود میباشد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            id: { type: "integer", example: "1" },
            agent_id: { type: "number", example: 1 },
            comment: { type: "String" },
            score: { type: "number", example: 4 },
            status: { type: "string", example: "pending, approved, rejected" },
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
    },
  })
  @ApiCreatedResponse({
    description: "کامنت با موفقیت ثبت شد. بعد از تایید منتشر میشود.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 201 },
        message: {
          type: "string",
          example: "کامنت با موفقیت ثبت شد. بعد از تایید منتشر میشود.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            id: { type: "integer", example: "1" },
            agent_id: { type: "number", example: 1 },
            comment: { type: "String" },
            score: { type: "number", example: 4 },
            status: { type: "string", example: "pending, approved, rejected" },
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
    },
  })
  @ApiOperation({ summary: "ثبت نظر" })
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  @Post()
  async create(
    @Body() body: CreateRealEstateAgentsCommentDto,
    @Request() req: any,
    @Response() res: any
  ) {
    body.client_id = req.user.id;
    const result = await this.agentsCommentsService.storeComment(body);

    if (result.status === 200) {
      const transformer = this.agentsCommentsTransformer.transform(
        result.result
      );

      return this.responseHandler.send(
        res,
        200,
        "نظر شما در سیستم موجود میباشد.",
        transformer
      );
    } else if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. مشاور املاک موردنظر وجود ندارد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorException();
    }

    const transformer = this.agentsCommentsTransformer.transform(result.result);
    return this.responseHandler.send(
      res,
      201,
      "لیست آیتم های فرم آگهی املاک در دسترس است.",
      transformer
    );
  }

  // لیست نظرات مشاور املاک
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
  @ApiOperation({ summary: "لیست نظرات مشاور املاک" })
  @Get()
  async findComments(
    @Query() query: GetCommentsListForRealEstateAgentDto,
    @Request() req: any,
    @Response() res: any
  ) {
    query.client_id = req.user.id;
    const result = await this.agentsCommentsService.findComments(query);
    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. آیتم موردنظر وجود ندارد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorException();
    }

    const transformer = this.agentsCommentsTransformer.collection(
      result.result
    );

    const user_comment = this.agentsCommentsTransformer.transform(
      result.user_comment
    );

    return this.responseHandler.send(
      res,
      200,
      "لیست نظرات ثبت شده در دسترس است.",
      {
        data: transformer,
        statistics: result.statistics,
        comment_submitted: result.comment_submitted,
        user_comment,
        metadata: result.metadata,
      }
    );
  }

  @ApiOperation({ summary: "حذف نظر  مشاور املاک" })
  @Delete("/comments")
  async deleteCommentForRealEstate(@Query() query: DeleteCommentDto) {
    return this.agentsCommentsService.deleteCommentForRealEstate(query);
  }
}
