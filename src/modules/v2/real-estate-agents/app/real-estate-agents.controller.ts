import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  Request,
  Response,
  UploadedFiles,
  UseGuards,
  Get,
  Query,
  Param,
  Delete,
  InternalServerErrorException,
} from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { join, parse } from "path";
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
import { RealEstateAgentsService } from "./real-estate-agents.service";
import { CreateRealEstateAgentDto } from "./dto/create-real-estate-agent.dto";
import { renameSync } from "fs";
import { InternalServerErrorHandler } from "src/modules/services/httpResponseHandler/internalServerErrorHandler";
import { ForbiddenErrorHandler } from "src/modules/services/httpResponseHandler/forbiddenErrorHandler";
import { JwtAuthGuard } from "src/modules/v2/jwt-auth/jwt-auth.guard";
import { ListRealEstateAgentDto } from "./dto/list-real-estate-agent.dto";
import RealEstateAgentsTransformer from "./Transformer";
import { CheckAvatarMiddleware } from "./dto/check-avatar.middleware";
import { CheckLicenseMiddleware } from "./dto/check-lisence.middleware";
import { SearchForRealEstateAgentDto } from "./dto/search.real-estate-agents.dto";

@UseGuards(JwtAuthGuard)
@ApiSecurity("JWT-auth")
@ApiTags("v2/app-real-estate-agents")
@Controller("v2/app/real-estate-agents")
export class RealEstateAgentsController {
  constructor(
    private readonly realEstateAgentsService: RealEstateAgentsService,
    private readonly realEstateAgentsTransFormer: RealEstateAgentsTransformer,
    private readonly responseHandler: HttpResponsehandler
  ) {}

  @ApiCreatedResponse({
    description:
      "درخواست شما با موفقیت ثبت شد. بعد تایید میتوانید از امکانات بخش موردنظر استفاده کنید.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 201 },
        message: {
          type: "string",
          example:
            "درخواست شما با موفقیت ثبت شد. بعد تایید میتوانید از امکانات بخش موردنظر استفاده کنید.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            client_id: { type: "integer", example: 1 },
            name: { type: "string" },
            phone: { type: "string" },
            validate_phone: { type: "boolean", default: false },
            avatar: { type: "string" },
            license: { type: "string" },
            license_status: {
              type: "string",
              example: "pending || approved || rejected",
            },
            status: { type: "string", example: "active, inactive" },
            score: { type: "number", example: 0 },
            number_of_ads: { type: "number", example: 0 },
            province: {
              type: "object",
              properties: {
                id: { type: "number" },
                name: { type: "string" },
              },
            },
            city: {
              type: "object",
              properties: {
                id: { type: "number" },
                name: { type: "string" },
              },
            },
            channel: {
              type: "object",
              properties: {
                id: { type: "number" },
                key: { type: "string" },
                name: { type: "string" },
                profile: { type: "string" },
              },
            },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: "ثبت درخواست مشاور شدن" })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: "avatar", maxCount: 1 },
        { name: "license", maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: "./public/contents/temp/estate_agents",
          filename: (req, file, callback) => {
            const extension = parse(join(file.originalname)).ext;
            const uniqueSuffix =
              Date.now() + "-" + Math.round(Math.random() * 1e9);
            callback(null, `${uniqueSuffix}${extension}`);
          },
        }),
      }
    ),
    CheckAvatarMiddleware,
    CheckLicenseMiddleware
  )
  @Post()
  @ApiBody({ type: CreateRealEstateAgentDto })
  @ApiConsumes("multipart/form-data")
  async create(
    @Body() createDto: CreateRealEstateAgentDto,
    @Request() req: any,
    @Response() res: Response,
    @UploadedFiles()
    files: { avatar?: Express.Multer.File; license?: Express.Multer.File }
  ) {
    const { avatar, license } = files;
    const avatarName = avatar ? avatar[0].filename : null;
    const licenseName = license ? license[0].filename : null;

    createDto.user_id = req.user.id;

    console.log("*** Store Request: RealEstateAgent ***");
    console.log(createDto);

    console.log({ avatarName });
    console.log({ licenseName });

    const result = await this.realEstateAgentsService.storeRequest(
      createDto,
      avatarName,
      licenseName
    );

    if (result.status === 500) {
      throw new InternalServerErrorHandler();
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    }

    const transform = this.realEstateAgentsTransFormer.transform(
      result.response
    );

    return this.responseHandler.send(
      res,
      201,
      "درخواست شما با موفقیت ثبت شد. بعد تایید میتوانید از امکانات بخش موردنظر استفاده کنید.",
      transform
    );
  }

  // دریافت لیست مشاوران املاک بر اساس استان انتخابی کاربر
  @ApiOkResponse({
    description: "لیست مشاوران املاک در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "لیست مشاوران املاک در دسترس است.",
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
                  id: { type: "integer", example: 1 },
                  client_id: { type: "integer", example: 1 },
                  name: { type: "string" },
                  phone: { type: "string" },
                  validate_phone: { type: "boolean", default: false },
                  avatar: { type: "string" },
                  license: { type: "string" },
                  license_status: {
                    type: "string",
                    example: "pending || approved || rejected",
                  },
                  status: { type: "string", example: "active, inactive" },
                  score: { type: "number", example: 0 },
                  number_of_ads: { type: "number", example: 0 },
                  province: {
                    type: "object",
                    properties: {
                      id: { type: "number" },
                      name: { type: "string" },
                    },
                  },
                  city: {
                    type: "object",
                    properties: {
                      id: { type: "number" },
                      name: { type: "string" },
                    },
                  },
                  channel: {
                    type: "object",
                    properties: {
                      id: { type: "number" },
                      key: { type: "string" },
                      name: { type: "string" },
                      profile: { type: "string" },
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
  @ApiOperation({ summary: "لیست مشاوران املاک" })
  @Get()
  async listOfRealEstateAgents(
    @Query() query: ListRealEstateAgentDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    const client_id = req.user.id;

    console.log("listOfRealEstateAgents");
    console.log({ query });

    const result = await this.realEstateAgentsService.listOfRealEstateAgents(
      query,
      client_id
    );

    const transformer = this.realEstateAgentsTransFormer.collection(
      result.list
    );

    return this.responseHandler.send(
      res,
      200,
      "لیست مشاوران املاک در دسترس است.",
      {
        data: transformer,
        metadata: result.metadata,
      }
    );
  }

  // سرچ مشاوران املاک
  @ApiOkResponse({
    description: "لیست مشاوران املاک در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "لیست مشاوران املاک در دسترس است.",
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
                  id: { type: "integer", example: 1 },
                  client_id: { type: "integer", example: 1 },
                  name: { type: "string" },
                  avatar: { type: "string" },
                  license: { type: "string" },
                  license_status: {
                    type: "string",
                    example: "pending || approved || rejected",
                  },
                  status: { type: "string", example: "active, inactive" },
                  score: { type: "number", example: 0 },
                  number_of_ads: { type: "number", example: 0 },
                  province: {
                    type: "object",
                    properties: {
                      id: { type: "number" },
                      name: { type: "string" },
                    },
                  },
                  city: {
                    type: "object",
                    properties: {
                      id: { type: "number" },
                      name: { type: "string" },
                    },
                  },
                  channel: {
                    type: "object",
                    properties: {
                      id: { type: "number" },
                      key: { type: "string" },
                      name: { type: "string" },
                      profile: { type: "string" },
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
  @ApiOperation({ summary: "سرچ مشاور املاک" })
  @Get("search")
  async search(
    @Query() query: SearchForRealEstateAgentDto,
    @Response() res: Response
  ) {
    console.log("search RealEstateAgents");
    console.log({ query });

    const result = await this.realEstateAgentsService.search(query);

    const transformer = this.realEstateAgentsTransFormer.collection(
      result.list
    );

    return this.responseHandler.send(
      res,
      200,
      "لیست مشاوران املاک در دسترس است.",
      {
        data: transformer,
        metadata: result.metadata,
      }
    );
  }

  // جزییات لیست مشاوران املاک
  @ApiOkResponse({
    description: "جزییات مشاوران املاک در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "جزییات مشاوران املاک در دسترس است.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            client_id: { type: "integer", example: 1 },
            name: { type: "string" },
            phone: { type: "string" },
            validate_phone: { type: "boolean", default: false },
            avatar: { type: "string" },
            license: { type: "string" },
            license_status: {
              type: "string",
              example: "pending || approved || rejected",
            },
            status: { type: "string", example: "active, inactive" },
            score: { type: "number", example: 0 },
            number_of_ads: { type: "number", example: 0 },
            province: {
              type: "object",
              properties: {
                id: { type: "number" },
                name: { type: "string" },
              },
            },
            city: {
              type: "object",
              properties: {
                id: { type: "number" },
                name: { type: "string" },
              },
            },
            channel: {
              type: "object",
              properties: {
                id: { type: "number" },
                key: { type: "string" },
                name: { type: "string" },
                profile: { type: "string" },
              },
            },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: "جزییات مشاور املاک" })
  @Get("info/:agent_id")
  async GetRealEstateAgentInfo(
    @Param("agent_id") agent_id: number,
    @Request() req: any,
    @Response() res: Response
  ) {
    const client_id = req.user.id;

    const result = await this.realEstateAgentsService.GetRealEstateAgentInfo(
      agent_id,
      client_id
    );

    const transformer = this.realEstateAgentsTransFormer.transform(
      result.list[0]
    );

    return this.responseHandler.send(
      res,
      200,
      "جزییات مشاوران املاک در دسترس است.",
      transformer
    );
  }

  @ApiOperation({
    summary: "دریافت فعال ترین مشاوران املاک (بر اساس انتشار انتشار آگهی)",
  })
  @Get("active")
  async getActiveRealEstates(@Query() query: ListRealEstateAgentDto) {
    console.log("getActiveRealEstates");
    console.log({ query });
    return this.realEstateAgentsService.getActiveRealEstates(query);
  }
}
