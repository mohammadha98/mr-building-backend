import { InternalServerErrorException, Query, UseGuards } from "@nestjs/common";
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Response,
} from "@nestjs/common";
import { RealEstateAgentsCommentsService } from "./real-estate-agents-comments.service";
import { UpdateRealEstateAgentsCommentDto } from "./dto/update-real-estate-agents-comment.dto";
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
import { ChangeStatusCommentAgentDto } from "./dto/change-status.dto";
import { BadRequestErrorHandler } from "src/modules/services/httpResponseHandler/badRequestErrorHandler";
import { GetCommentsListForRealEstateAgentDto } from "./dto/get-list..dto copy";
import AdminTokenAuthGuard from "../../jwt-auth/AdminTokenAuthGuard";

@UseGuards(AdminTokenAuthGuard)
@ApiSecurity("JWT-auth")
@ApiTags("v1/admin-real-estate-agents-comments")
@Controller("v1/admin/real-estate-agents-comments")
export class RealEstateAgentsCommentsController {
  constructor(
    private readonly responseHandler: HttpResponsehandler,
    private readonly agentsCommentsService: RealEstateAgentsCommentsService,
    private readonly agentsCommentsTransformer: RealEstateAgentsCommentsTransformer
  ) {}

  // لیست نظرات
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
                    example: "pending, approved, active, rejected",
                  },
                  client: {
                    type: "object",
                    properties: {
                      id: { type: "integer" },
                      name: { type: "String" },
                    },
                  },
                  real_estate_agent: {
                    type: "object",
                    properties: {
                      id: { type: "integer" },
                      name: { type: "String" },
                      avatar: { type: "String" },
                    },
                  },
                  created_at: { type: "String", example: "" },
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
  @ApiOperation({ summary: "لیست نظرات مشاوران املاک" })
  @Get()
  async findAllComments(
    @Query() query: GetCommentsListForRealEstateAgentDto,
    @Request() req: any,
    @Response() res: any
  ) {
    query.user_id = req.user.id;
    const result = await this.agentsCommentsService.findAllComments(query);

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
      "لیست نظرات ثبت شده در دسترس است.",
      {
        data: transformer,
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
  @Post("change_status")
  async changeStatus(
    @Body() body: ChangeStatusCommentAgentDto,
    @Request() req: any,
    @Response() res: any
  ) {
    console.log("ChangeStatusCommentAgentDto");
    body.user_id = req.user.id;
    console.log(body);
    const result = await this.agentsCommentsService.changeStatus(body);

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. کامنت موردنظر موجود نمیباشد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorException();
    }

    return this.responseHandler.send(res, 201, "تغییر وضعیت انجام شد.");
  }

  // @Get(":id")
  findOne(@Param("id") id: string) {
    return this.agentsCommentsService.findOne(+id);
  }

  // @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateRealEstateAgentsCommentDto: UpdateRealEstateAgentsCommentDto
  ) {
    return this.agentsCommentsService.update(
      +id,
      updateRealEstateAgentsCommentDto
    );
  }

  // @Delete(":id")
  remove(@Param("id") id: string) {
    return this.agentsCommentsService.remove(+id);
  }
}
