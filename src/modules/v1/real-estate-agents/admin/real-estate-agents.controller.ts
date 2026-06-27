import {
  Controller,
  Request,
  Response,
  UseGuards,
  Get,
  Query,
  Param,
  Patch,
  InternalServerErrorException,
  Delete,
  Body,
} from "@nestjs/common";
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { RealEstateAgentsService } from "./real-estate-agents.service";
import { InternalServerErrorHandler } from "src/modules/services/httpResponseHandler/internalServerErrorHandler";
import { ForbiddenErrorHandler } from "src/modules/services/httpResponseHandler/forbiddenErrorHandler";
import { ListRealEstateAgentDto } from "./dto/list-real-estate-agent.dto";
import RealEstateAgentsTransformer from "./Transformer";
import { RealEstateAgentChangeStatusDto } from "./dto/real-estate-change-change-status.dtop";
import AdminTokenAuthGuard from "../../jwt-auth/AdminTokenAuthGuard";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import RealEstateAdsTransformer from "../../real-estate-ads/admin/Transformer";
import { BadRequestErrorHandler } from "src/modules/services/httpResponseHandler/badRequestErrorHandler";
import RealEstateAgentsCommentsTransformer from "../../real-estate-agents-comments/admin/Transformer";
import { DeleteRealEstateAgentsAdvisorsDto } from "../../real-estate-agents-advisors/app/dto/delete-real-estate-agents-advisors.dto";

@UseGuards(AdminTokenAuthGuard)
@ApiSecurity("JWT-auth")
@ApiTags("v1/admin-real-estate-agents")
@Controller("v1/admin/real-estate-agents")
export class RealEstateAgentsController {
  constructor(
    private readonly realEstateAgentsService: RealEstateAgentsService,
    private readonly realEstateAgentsTransFormer: RealEstateAgentsTransformer,
    private readonly responseHandler: HttpResponsehandler,
    private readonly realEstateAdsTransformer: RealEstateAdsTransformer,
    private readonly agentsCommentsTransformer: RealEstateAgentsCommentsTransformer
  ) {}

  // دریافت لیست مشاوران املاک
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
  @ApiOperation({ summary: "لیست مشاوران املاک " })
  @Get()
  async listOfRealEstateAgents(
    @Query() query: ListRealEstateAgentDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    console.log("listOfRealEstateAgents: ADMIN");
    console.log("ip_address: ", req.ip_address);

    const result = await this.realEstateAgentsService.listOfRealEstateAgents(
      query
    );

    if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

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

  // تغییر وضعیت
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
          properties: {
            status: { type: "string", example: "active, inactive" },
            license_status: {
              type: "string",
              example: "pending, approved, rejected",
            },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: "تغییر وضعیت" })
  @Patch("/change-status")
  async changeStatus(
    @Query() query: RealEstateAgentChangeStatusDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    query.user_id = req.user.id;
    const result = await this.realEstateAgentsService.changeStatus(query);
    if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    return this.responseHandler.send(res, 200, "وضعیت با موفقیت تغییر کرد.", {
      status: result.client_status,
      license_status: result.license_status,
    });
  }

  // دریافت آگهی ها
  @ApiOkResponse({
    description: "لیست آگهی ها در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "لیست آگهی ها در دسترس است.",
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
                  type: {
                    type: "String",
                    example: "sale, presell, collaboration, rent",
                  },
                  title: { type: "String" },
                  sale_price: { type: "String" },
                  deposit_price: { type: "String" },
                  rent_price: { type: "String" },
                  prepaid_price: { type: "String" },
                  status: {
                    type: "String",
                    example: "pending, rejected, approved, inactive, expired",
                  },
                  province: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      name: { type: "string" },
                    },
                  },
                  city: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      name: { type: "string" },
                    },
                  },
                  area: { type: "String" },
                  seller_type: { type: "String" },
                  media: {
                    type: "object",
                    properties: {
                      id: { type: "number", example: 1 },
                      file_name: { type: "string" },
                      file_type: { type: "string", example: "image" },
                      file_url: { type: "string" },
                      sort_number: { type: "string" },
                      priority: { type: "string", example: "primary" },
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
  @ApiOperation({ summary: "دریافت آگهی ها" })
  @Get("/ads/:agent_id")
  async findAds(
    @Param("agent_id") agent_id: number,
    @Query() query: PaginationDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    const result = await this.realEstateAgentsService.findAds(agent_id, query);

    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorException();
    }

    const transformer = this.realEstateAdsTransformer.collectionAdList(
      result.result
    );
    return this.responseHandler.send(res, 200, "لیست آگهی ها در دسترس است.", {
      data: transformer,
      metadata: result.metadata,
    });
  }

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
              number_of_ads: { type: "integer", example: 1 },
              total_customers: { type: "integer", example: 1 },
              score: { type: "integer", example: 1 },
              biography: { type: "string" },
              comment_visibility: { type: "boolean" },
              avatar: { type: "string" },
              status: { type: "string", example: "active, inactive" },
              phone: { type: "string" },
              validate_phone: { type: "boolean" },
              client: {
                type: "object",
                properties: {
                  id: { type: "integer", example: 1 },
                  name: { type: "string" },
                  surname: { type: "string" },
                  phone: { type: "string" },
                },
              },
              real_estate_agent: {
                type: "object",
                properties: {
                  id: { type: "integer", example: 1 },
                  name: { type: "string" },
                  score: { type: "integer" },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: "دریافت لیست کارشناس های یک مشاور املاک" })
  @Get("/advisors/:agent_id")
  async findAdvisors(
    @Param("agent_id") agent_id: number,
    @Request() req: any,
    @Response() res: Response
  ) {
    console.log("*** RealEstateAgentsAdvisor: ADMIN ***");
    console.log({ agent_id });

    const result = await this.realEstateAgentsService.findAdvisors(agent_id);
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

  // دریافت لیست ادمین های یک مشاور املاک
  @ApiOkResponse({
    description: "لیست ادمین های ادمین در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "لیست ادمین های ادمین در دسترس است.",
        },
        error: { type: "string" },
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              permissions: { type: "array", items: {} },
              color: { type: "string" },
              client: {
                type: "object",
                properties: {
                  id: { type: "integer", example: 1 },
                  name: { type: "string" },
                  surname: { type: "string" },
                  phone: { type: "string" },
                },
              },
              real_estate_agent: {
                type: "object",
                properties: {
                  id: { type: "integer", example: 1 },
                  name: { type: "string" },
                  avatar: { type: "string" },
                  number_of_ads: { type: "integer" },
                  score: { type: "integer" },
                  province: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: "دریافت لیست ادمین های یک مشاور املاک" })
  @Get("/admin/:agent_id")
  async findAdmins(
    @Param("agent_id") agent_id: number,
    @Request() req: any,
    @Response() res: Response
  ) {
    console.log("*** RealEstateAgentsAdmin: ADMIN ***");
    console.log({ agent_id });

    const result = await this.realEstateAgentsService.findAdmins(agent_id);
    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. مشاور املاک موردنظر وجود ندارد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    return this.responseHandler.send(
      res,
      200,
      "لیست ادمین های ادمین در دسترس است.",
      result.admins
    );
  }

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
  @ApiOperation({ summary: "لیست نظرات مشاور املاک" })
  @Get("/comments/:agent_id")
  async findAllComments(
    @Param("agent_id") agent_id: number,
    @Query() query: PaginationDto,
    @Request() req: any,
    @Response() res: any
  ) {
    query.user_id = req.user.id;
    const result = await this.realEstateAgentsService.findAllComments(
      agent_id,
      query
    );

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

  @ApiOperation({ summary: "حذف کارشناس از مشاور املاکی" })
  @Delete("/comments/:agent_id")
  async removeAdvisorInRealEstate(
    @Body() body: DeleteRealEstateAgentsAdvisorsDto
  ) {
    console.log("Remove Advisor In RealEstate");
    console.log({ Body });
    return this.realEstateAgentsService.removeAdvisorInRealEstate(body);
  }

  // TODO: Test Function and Delete this
  @ApiOperation({ summary: "تست - ایجاد کد اختصاصی" })
  @Get("/tracking_code")
  async generateTrackingCode() {
    return await this.realEstateAgentsService.makeTrackingCode();
  }

  // TODO: delete after run
  @ApiOperation({ summary: "تست - ایجاد کانال برای مشاوران قدیمی" })
  @Get("/create-channel")
  async CreateChannelForOldRealEstates_test() {
    return await this.realEstateAgentsService.CreateChannelForOldRealEstates_test();
  }
}
