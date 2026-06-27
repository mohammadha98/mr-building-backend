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
import ServicesModuleAppTransformer from "./Transformer";
import { GetServicesMediaDto } from "./dto/get-service-media-module.dto";
import { BadRequestErrorHandler } from "src/modules/services/httpResponseHandler/badRequestErrorHandler";
import { SaveCommentInServicesDto } from "./dto/save-comment.dto";
import { GetCommentsDto } from "./dto/get-comments.dto";
import TokenAuthGuardClient from "../../jwt-auth/TokenAuthGuardClient";

@UseGuards(TokenAuthGuardClient)
@ApiSecurity("JWT-auth")
@ApiTags("v1/app/services-module")
@Controller("v1/app/services-module")
export class ServiceModulesController {
  private readonly httpResponsehandler: HttpResponsehandler;

  constructor(
    private readonly serviceModulesService: ServiceModulesService,
    private readonly transformer: ServicesModuleAppTransformer
  ) {
    this.httpResponsehandler = new HttpResponsehandler();
  }

  // جزییات خدمات
  @ApiOkResponse({
    description: "جزییات خدمات در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 200 },
        message: {
          type: "string",
          example: "جزییات خدمات در دسترس است.",
        },
        error: { type: "string", example: "" },
        data: {
          type: "object",
          properties: {
            total_comment: {
              type: "number",
            },
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
  @ApiBadRequestResponse()
  @ApiOperation({ summary: "جزییات خدمات" })
  @Get()
  async findAll(
    @Query() query: GetServicesMediaDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    console.log("****** get serviceInfo: APP ******");
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
      "جزییات خدمات در دسترس است.",
      {
        total_comments: result.service.total_comments,
        info: serviceInfo,
        list: media,
      }
    );
  }

  // ذخیره کامنت جدید
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
            content: { type: "string" },
            client_id: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                surname: { type: "string" },
              },
            },
            replied_to: { type: "null" },
            created_at: {
              type: "object",
              properties: {
                day: { type: "integer" },
                month: { type: "string" },
                year: { type: "integer" },
                time: { type: "string" },
              },
            },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: "ذخیره کامنت جدید" })
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  @Post("/comments")
  async saveComment(
    @Body() body: SaveCommentInServicesDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.user_id = req.user.id;

    console.log("****** save comment in DeActiveServices ******");
    console.log({ body });

    const result = await this.serviceModulesService.saveServiceInfo(body);
    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. آیتم موردنظر وجود ندارد.");
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }
    const transformer = this.transformer.transformComment(
      result.result,
      body.user_id
    );
    return this.httpResponsehandler.send(
      res,
      201,
      "درخواست با موفقیت انجام شد.",
      transformer
    );
  }

  // دریافت کامنت ها
  @ApiOkResponse({
    description: "لیست کامنت ها در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 200 },
        message: {
          type: "string",
          example: "لیست کامنت ها در دسترس است.",
        },
        error: { type: "string", example: "" },
        data: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  content: { type: "string" },
                  client_id: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      name: { type: "string" },
                      surname: { type: "string" },
                    },
                  },
                  is_replied: { type: "boolean" },
                  is_liked: { type: "boolean" },
                  total_like: { type: "number" },
                  replied_to: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      content: { type: "string" },
                      client_id: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          name: { type: "string" },
                          surname: { type: "string" },
                        },
                      },
                      replied_to: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          content: { type: "string" },
                          client_id: {
                            type: "object",
                            properties: {
                              id: { type: "string" },
                              name: { type: "string" },
                              surname: { type: "string" },
                            },
                          },
                          replied_to: { type: "null" },
                          created_at: {
                            type: "object",
                            properties: {
                              day: { type: "integer" },
                              month: { type: "string" },
                              year: { type: "integer" },
                              time: { type: "string" },
                            },
                          },
                        },
                      },
                      created_at: {
                        type: "object",
                        properties: {
                          day: { type: "integer" },
                          month: { type: "string" },
                          year: { type: "integer" },
                          time: { type: "string" },
                        },
                      },
                    },
                  },
                  created_at: {
                    type: "object",
                    properties: {
                      day: { type: "integer" },
                      month: { type: "string" },
                      year: { type: "integer" },
                      time: { type: "string" },
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
  @ApiOperation({ summary: "دریافت کامنت ها" })
  @Get("/comments")
  async getComments(
    @Query() query: GetCommentsDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    query.user_id = req.user.id;
    console.log("****** Get Comments in DeActiveServices ******");

    const result = await this.serviceModulesService.getComments(query);
    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. آیتم موردنظر وجود ندارد.");
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }
    const transformer = this.transformer.collectionComments(
      result.result,
      Number(query.user_id)
    );
    return this.httpResponsehandler.send(
      res,
      201,
      "لیست کامنت ها در دسترس است.",
      {
        data: transformer,
        metadata: result.metadata,
      }
    );
  }

  // لایک و دیسلایک
  @ApiOkResponse({
    description: "درخواست شما انجام شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 200 },
        message: {
          type: "string",
          example: "درخواست شما انجام شد.",
        },
        error: { type: "string", example: "" },
        data: {
          type: "object",
          properties: {},
        },
      },
    },
  })
  @ApiOperation({ summary: "لایک و دیسلایک" })
  @Post("/comments/:comment_id")
  async actionForComment(
    @Param("comment_id") comment_id: string,
    @Request() req: any,
    @Response() res: Response
  ) {
    console.log("****** Action Comments in DeActiveServices: APP ******");
    console.log({ comment_id });
    console.log({ clientID: req.user.id });

    const result = await this.serviceModulesService.actionForComment(
      comment_id,
      req.user.id
    );
    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. آیتم موردنظر وجود ندارد.");
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    return this.httpResponsehandler.send(
      res,
      result.status,
      "درخواست شما انجام شد."
    );
  }
}
