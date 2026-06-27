import {
  Controller,
  Get,
  Body,
  Res,
  Request,
  Response,
  UseGuards,
  Query,
  Post,
  Delete,
  Param,
  InternalServerErrorException,
} from "@nestjs/common";
import { ClientService } from "./client.service";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import ClientTransformer from "./Transformer";
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
  getSchemaPath,
} from "@nestjs/swagger";

import BadRequestSchema from "src/commons/contracts/swaggerDefinations/BadRequestSchema";
import InternalServerErrorSchema from "src/commons/contracts/swaggerDefinations/InternalServerErrorSchema";
import { ForbiddenErrorHandler } from "src/modules/services/httpResponseHandler/forbiddenErrorHandler";
import { FormDataRequest } from "nestjs-form-data";
import { InternalServerErrorHandler } from "src/modules/services/httpResponseHandler/internalServerErrorHandler";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import { CreateOperatorRealEstateAgentDto } from "./dto/create-operator-real-estate-agent";
import { BadRequestErrorHandler } from "src/modules/services/httpResponseHandler/badRequestErrorHandler";
import AdminTokenAuthGuard from "../../jwt-auth/AdminTokenAuthGuard";
import ReportsTransformer from "../../reports/admin/Transformer";
import { ClientReportsPaginationDto } from "./dto/Client-Reports-Pagination.dto";
import PrizesTransformer from "../../prizes/app/transformer";
import RealEstateAdsTransformer from "../../real-estate-ads/admin/Transformer";

@UseGuards(AdminTokenAuthGuard)
@ApiSecurity("JWT-auth")
@ApiTags("v1/admin-clients")
@Controller("v1/admin/clients")
export class ClientController {
  private responsehandler: HttpResponsehandler;
  private clientTransformer: ClientTransformer;

  constructor(
    private readonly clientService: ClientService,
    private readonly reportsTransformer: ReportsTransformer,
    private readonly prizesTransformer: PrizesTransformer,
    private readonly realEstateAdsTransformer: RealEstateAdsTransformer
  ) {
    this.responsehandler = new HttpResponsehandler();
    this.clientTransformer = new ClientTransformer();
  }

  // get client profile

  // ok response
  @ApiOkResponse({
    description: "دریافت اطلاعات پروفایل کاربر با موفقیت انجام شد",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "دریافت اطلاعات پروفایل کاربر با موفقیت انجام شد",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            surname: { type: "string" },
            phone: { type: "string" },
            user_name: { type: "string" },
            email: { type: "string" },
            avatar: { type: "string" },
            token: { type: "string" },
            created_at: { type: "string" },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: "دریافت اطلاعات پروفایل کاربر" })
  @Get("/info/:client_id")
  async findOne(
    @Param("client_id") client_id: number,
    @Request() req: any,
    @Res() res: Response
  ) {
    console.log("Get Clients: ADMIN");
    console.log("ip_address: ", req.ip_address);

    const client = await this.clientService.findOneByID(client_id);
    if (!client) {
      throw new ForbiddenErrorHandler();
    }

    const clientTransformer = this.clientTransformer.transform(client);
    return this.responsehandler.send(
      res,
      200,
      "اطلاعات پروفایل کاربر در دسترس است.",
      clientTransformer
    );
  }

  // get client list
  // ok response
  @ApiResponse({
    status: 200,
    description: ".تکمیل ثبت نام با موفقیت بروزرسانی شد",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: ".تکمیل ثبت نام با موفقیت بروزرسانی شد",
        },
        data: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  name: { type: "string" },
                  surname: { type: "string" },
                  phone: { type: "string" },
                  user_name: { type: "string" },
                  email: { type: "string" },
                  avatar: { type: "string" },
                  token: { type: "string" },
                  created_at: { type: "string" },
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

  // BadRequest Response
  @ApiBadRequestResponse({
    type: BadRequestSchema,
    description:
      "خطا. درخواست به درستی ارسال نشده است. لطفا اطلاعات ارسالی را بررسی کنید.",
  })

  // InternalServerError Response
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorSchema,
    description: "خطای سرور. لطفا کمی بعد تلاش کنید",
    schema: {
      $ref: getSchemaPath(InternalServerErrorSchema),
    },
  })
  @Get("/list")
  @ApiOperation({ summary: "لیست کلاینت ها  " })
  @ApiConsumes("multipart/form-data")
  async clientList(
    @Query() queryDto: PaginationDto,
    @Request() request: any,
    @Response() response: any
  ) {
    const result = await this.clientService.findAll(queryDto);

    const clientTransformer = this.clientTransformer.collection(result.clients);
    return this.responsehandler.send(
      response,
      200,
      "لیست کاربران پنل در دسترس است.",
      {
        data: clientTransformer,
        metadata: result.metadata,
      }
    );
  }

  // لیست  اپراتورهای عمومی املاک
  @ApiResponse({
    status: 200,
    description: ".تکمیل ثبت نام با موفقیت بروزرسانی شد",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: ".تکمیل ثبت نام با موفقیت بروزرسانی شد",
        },
        data: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  name: { type: "string" },
                  surname: { type: "string" },
                  phone: { type: "string" },
                  user_name: { type: "string" },
                  email: { type: "string" },
                  avatar: { type: "string" },
                  token: { type: "string" },
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
  @Get("/operators/real_estate_agents")
  @ApiOperation({ summary: "لیست  اپراتورهای عمومی املاک" })
  @ApiConsumes("multipart/form-data")
  async getPublicOperators(
    @Query() queryDto: PaginationDto,
    @Request() request: any,
    @Response() response: any
  ) {
    const result = await this.clientService.getPublicOperators(queryDto);

    const clientTransformer = this.clientTransformer.collection(result.clients);
    return this.responsehandler.send(
      response,
      200,
      "لیست کاربران پنل در دسترس است.",
      {
        data: clientTransformer,
        metadata: result.metadata,
      }
    );
  }

  // تعیین اپراتور عمومی -  مشاوراملاک
  @ApiResponse({
    status: 200,
    description: ".تکمیل ثبت نام با موفقیت بروزرسانی شد",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: ".تکمیل ثبت نام با موفقیت بروزرسانی شد",
        },
        data: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            surname: { type: "string" },
            phone: { type: "string" },
            user_name: { type: "string" },
            email: { type: "string" },
            avatar: { type: "string" },
            token: { type: "string" },
          },
        },
      },
    },
  })
  @Post("/operators/real_estate_agents")
  @ApiOperation({ summary: "تعیین اپراتور عمومی -  مشاوراملاک" })
  async saveNewPublicOperators(
    @Body() body: CreateOperatorRealEstateAgentDto,
    @Request() request: any,
    @Response() response: any
  ) {
    body.user_id = request.user.id;
    console.log("*** Create Operator RealEstate Agent Dto ***");
    console.log(body);

    const result = await this.clientService.saveNewPublicOperators(body);

    if (result.status === 400) {
      throw new BadRequestErrorHandler(
        "خطا. امکان اضافه کردن نقش جدید به کاربر فراهم نمیباشد."
      );
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    const clientTransformer = this.clientTransformer.transform(result.client);
    return this.responsehandler.send(
      response,
      result.status,
      "لیست اپراتور های مشاوران املاک در دسترس است.",
      clientTransformer
    );
  }

  // حذف اپراتور عمومی -  مشاوراملاک
  @Delete("/operators/real_estate_agents/:client_id")
  @ApiOperation({ summary: "حذف اپراتور عمومی -  مشاوراملاک" })
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  async deletePublicOperators(
    @Param("client_id") client_id: number,
    @Request() request: any,
    @Response() response: any
  ) {
    const body = {
      user_id: request.user.id,
      client_id,
    };
    console.log("*** DeleteOperatorRealEstateAgentDto ***");
    console.log(body);

    const result = await this.clientService.deletePublicOperator(body);
    console.log(result.status);
    if (result.status === 400) {
      throw new BadRequestErrorHandler(
        "خطا. کلاینت مورد نظر به دسترسی اپراتوی مشاوران املاک را ندارد."
      );
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    return this.responsehandler.send(
      response,
      200,
      "حذف اپراتور با موفقیت انجام شد."
    );
  }

  // @Post("generate-key")
  async generateKeyForClients(
    @Request() request: any,
    @Response() response: any
  ) {
    console.log("*** generateKeyForClients ***");
    await this.clientService.generateKeyForClients(request.user.id);

    return this.responsehandler.send(response, 200, "کلیدها ایجاد شدند");
  }

  // دریافت گزارشات ارسالی
  @ApiOkResponse({
    description: "لیست گزارشات ارسال در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "لیست گزارشات ارسال در دسترس است.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                properties: {
                  id: { type: "integer", example: 1 },
                  type: { type: "string" },
                  content: { type: "string" },
                  image: { type: "string" },
                  voice: { type: "string" },
                  created_at: { type: "string" },
                  client: {
                    type: "object",
                    properties: {
                      id: { type: "integer", example: 1 },
                      name: { type: "integer", example: 1 },
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
  @ApiOperation({ summary: "دریافت گزارشات ارسالی" })
  @Get("reports")
  async getAllReports(
    @Query() query: ClientReportsPaginationDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    // TODO: log
    console.log("*** Get Client reports ***");
    console.log(query);
    const body = {
      client_id: query.client_id,
      page: query.page,
      per_page: query.per_page,
      type: query.type,
    };

    const result = await this.clientService.getAllReports(body);
    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    const transformer = this.reportsTransformer.collection(result.list);

    return this.responsehandler.send(
      res,
      200,
      "لیست گزارشات ارسال در دسترس است.",
      {
        data: transformer,
        metadata: result.metadata,
      }
    );
  }

  // دریافت گزارشات ارسالی
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
                  coupon: { type: "string" },
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
  @Get("prizes/:client_id")
  async getAllPrizes(
    @Param("client_id") client_id: string,
    @Query() query: PaginationDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    // TODO: log
    console.log("*** Get Client Prizes ***");
    const body = {
      client_id,
      page: query.page,
      per_page: query.per_page,
    };
    console.log({ body });

    const result = await this.clientService.getUserPrizes(body);
    if (result.result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    const transformer = this.prizesTransformer.collection(result.result.prizes);

    return this.responsehandler.send(res, 200, "لیست جوایز در دسترس است.", {
      data: transformer,
      metadata: result.result.metadata,
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
  @Get("/prizes/history/:client_id")
  async getHistoryOfScores(
    @Param("client_id") client_id: string,
    @Query() query: PaginationDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    query.user_id = req.user.id;

    console.log("*** Get HistoryOfScores: ADMIN ***");
    const body = {
      client_id,
      page: query.page,
      per_page: query.per_page,
    };
    console.log({ body });

    const result = await this.clientService.getHistoryOfScores(body);

    const transformer = this.prizesTransformer.historyOfScorCollection(
      result.result.history
    );

    return this.responsehandler.send(
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
  @Get("/ads/:client_id")
  async findAds(
    @Param("client_id") client_id: number,
    @Query() query: PaginationDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    query.user_id = client_id;

    const result = await this.clientService.findAds(query);

    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorException();
    }

    const transformer = this.realEstateAdsTransformer.collectionAdList(
      result.result
    );
    return this.responsehandler.send(res, 200, "لیست آگهی ها در دسترس است.", {
      data: transformer,
      metadata: result.metadata,
    });
  }
}
