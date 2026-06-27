import {
  Controller,
  Get,
  Res,
  Request,
  Response,
  UseGuards,
  Post,
  Body,
  Query,
  Delete,
  Param,
  Patch,
} from "@nestjs/common";
import { WebinarService } from "./webinar.service";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { JwtAuthGuard } from "src/modules/v1/jwt-auth/jwt-auth.guard";
import WebinarTransformer from "./Transformer";
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";

import InternalServerErrorSchema from "src/commons/contracts/swaggerDefinations/InternalServerErrorSchema";
import EventService from "../provider/EventService";
import { CreateWebinarDto } from "./dto/create-webinar.dto";
import { FormDataRequest } from "nestjs-form-data";
import { SaveProceedingDto } from "./dto/SaveProceedingDto";
import { DeleteWebinarDto } from "./dto/delete-webinar.dto.ts";
import { ForbiddenErrorHandler } from "src/modules/services/httpResponseHandler/forbiddenErrorHandler";
import { UpdateWebinarDto } from "./dto/update-webinar.dto";
import { InviteContactDto } from "./dto/InviteContactDto";
import { ClientWebinarsDto } from "./dto/ClientWebinarsDto";
import { InvitedClientsIntoWebinarDto } from "./dto/InvitedClientsIntoWebinarDto";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";

import { Inject } from "@nestjs/common";
import { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { tooManyRequestErrorHandler } from "src/modules/services/httpResponseHandler/tooManyRequestErrorHandler";

@UseGuards(JwtAuthGuard)
@ApiSecurity("JWT-auth")
@ApiTags("v1/app-webinar")
@Controller("v1/app/webinar")
export class WebinarController {
  private responsehandler: HttpResponsehandler;
  private webinarTransformer: WebinarTransformer;
  private eventService: EventService;
  private eventToken: string;

  constructor(
    private readonly weninarService: WebinarService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {
    this.responsehandler = new HttpResponsehandler();
    this.webinarTransformer = new WebinarTransformer();
    this.eventService = new EventService();
  }

  // ثبت وبینار جدید توسط کاربر

  // ApiCreated Response
  @ApiCreatedResponse({
    description: "وبینار جدید با موفقیت ثبت شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 201 },
        message: {
          type: "string",
          example: "وبینار جدید با موفقیت ثبت شد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            is_owner: { type: "boolean", example: false },
            title: { type: "string" },
            description: { type: "string" },
            type: {
              type: "string",
              example: "نوع وبنیار: private, public",
            },
            tag: { type: "string" },
            event_link: { type: "string" },
            status: {
              type: "string",
              example: "وضعیت به 2 حالت ثبت میشود: active, inactive,",
            },
            proceeding: { type: "string", example: "متن صورتجلسه" },
            guest_access: {
              type: "string",
              example:
                "اگر مقدار 1 داشته باشد یعنی کاربران مهمان اجازه دسترسی به وبینار را دارند.",
            },
            guest_count: {
              type: "integer",
              example:
                "در صورتیکه کاربران مهمان مجاز به شرکت در وبینار باشد عدد آن بیشتر از 0 است و اگر کاربران مهمان مجاز نباشند عدد آن 0 است.",
            },
            created_at: { type: "string" },
            started_at: { type: "string" },
            start_time: { type: "string" },
            end_time: { type: "string" },
            login_info: {
              type: "object",
              properties: {
                username: { type: "string" },
                password: { type: "string" },
              },
            },
          },
        },
      },
    },
  })
  @ApiBody({ type: CreateWebinarDto })
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "ایجاد وبینار توسط کاربران" })
  @FormDataRequest()
  @Post()
  async store(
    @Body() createWebinarDto: CreateWebinarDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    createWebinarDto.user_id = req.user.id;

    const result = await this.weninarService.store(createWebinarDto);

    if (result.status === 500) {
      throw new InternalServerErrorSchema();
    }
    const transformer = this.webinarTransformer.transform(
      result.webinar,
      result.client
    );
    return this.responsehandler.send(
      res,
      201,
      "وبینار جدید با موفقیت ثبت شد.",
      transformer
    );
  }

  //  لیست وبینارها
  @ApiOperation({
    summary: "لیست وبینارها",
    description: "صفحه بندی وجود دارد.",
  })
  @ApiConsumes("multipart/form-data")
  // ok response
  @ApiOkResponse({
    description: "لیست وبینارهای کاربر در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "لیست وبینارهای کاربر در دسترس است.",
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
                  is_owner: { type: "boolean", example: false },
                  title: { type: "string" },
                  description: { type: "string" },
                  type: {
                    type: "string",
                    example: "private, public",
                  },
                  tag: { type: "string" },
                  event_link: { type: "string" },
                  status: {
                    type: "string",
                    example: "وضعیت به 2 حالت ثبت میشود: active, inactive,",
                  },
                  proceeding: { type: "string", example: "متن صورتجلسه" },
                  guest_access: {
                    type: "string",
                    example:
                      "اگر مقدار 1 داشته باشد یعنی کاربران مهمان اجازه دسترسی به وبینار را دارند.",
                  },
                  guest_count: {
                    type: "integer",
                    example:
                      "در صورتیکه کاربران مهمان مجاز به شرکت در وبینار باشد عدد آن بیشتر از 0 است و اگر کاربران مهمان مجاز نباشند عدد آن 0 است.",
                  },
                  created_at: { type: "string" },
                  started_at: { type: "string" },
                  start_time: { type: "string" },
                  end_time: { type: "string" },
                  login_info: {
                    type: "object",
                    properties: {
                      username: { type: "string" },
                      password: { type: "string" },
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
  @Get("/list")
  async findAllMyOwnWebinars(
    @Query() query: PaginationDto,
    @Request() req: any,
    @Res() res: Response
  ) {
    query.user_id = req.user.id;
    const weninars = await this.weninarService.findAllMyOwnWebinars(query);
    if (weninars.status === 500) {
      throw new InternalServerErrorSchema();
    } else if (weninars.status === 403) {
      throw new ForbiddenErrorHandler();
    }

    const webinarTransformer = this.webinarTransformer.collection(
      weninars.list as any,
      weninars.client_info
    );
    return this.responsehandler.send(
      res,
      200,
      "لیست وبینارهای کاربر در دسترس است.",
      {
        data: webinarTransformer,
        metadata: weninars.metadata,
      }
    );
  }

  // دریافت وبینار های کاربر
  @ApiOperation({
    summary: "دریافت وبینار های کاربر",
    description:
      "لیست وبینار های کاربر بر اساس ماه و سال جاری ارسال میشود. \n \nماه و سال به میلادی و به صورت عددی ارسال شود",
  })
  @ApiConsumes("multipart/form-data")
  // ok response
  @ApiOkResponse({
    description: "لیست وبینارهای کاربر در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "لیست وبینارهای کاربر در دسترس است.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            1: {
              type: "array",
              items: {
                properties: {
                  id: { type: "integer", example: 1 },
                  is_owner: { type: "boolean", example: false },
                  title: { type: "string" },
                  description: { type: "string" },
                  type: {
                    type: "string",
                    example: "private, public",
                  },
                  tag: { type: "string" },
                  event_link: { type: "string" },
                  status: {
                    type: "string",
                    example: "وضعیت به 2 حالت ثبت میشود: active, inactive,",
                  },
                  proceeding: { type: "string", example: "متن صورتجلسه" },
                  guest_access: {
                    type: "string",
                    example:
                      "اگر مقدار 1 داشته باشد یعنی کاربران مهمان اجازه دسترسی به وبینار را دارند.",
                  },
                  guest_count: {
                    type: "integer",
                    example:
                      "در صورتیکه کاربران مهمان مجاز به شرکت در وبینار باشد عدد آن بیشتر از 0 است و اگر کاربران مهمان مجاز نباشند عدد آن 0 است.",
                  },
                  created_at: { type: "string" },
                  started_at: { type: "string" },
                  start_time: { type: "string" },
                  end_time: { type: "string" },
                  login_info: {
                    type: "object",
                    properties: {
                      username: { type: "string" },
                      password: { type: "string" },
                    },
                  },
                },
              },
            },
            2: {
              type: "array",
              items: {
                properties: {
                  id: { type: "integer", example: 1 },
                  is_owner: { type: "boolean", example: false },
                  title: { type: "string" },
                  description: { type: "string" },
                  type: {
                    type: "string",
                    example: "private, public",
                  },
                  tag: { type: "string" },
                  event_link: { type: "string" },
                  status: {
                    type: "string",
                    example: "وضعیت به 2 حالت ثبت میشود: active, inactive,",
                  },
                  proceeding: { type: "string", example: "متن صورتجلسه" },
                  guest_access: {
                    type: "string",
                    example:
                      "اگر مقدار 1 داشته باشد یعنی کاربران مهمان اجازه دسترسی به وبینار را دارند.",
                  },
                  guest_count: {
                    type: "integer",
                    example:
                      "در صورتیکه کاربران مهمان مجاز به شرکت در وبینار باشد عدد آن بیشتر از 0 است و اگر کاربران مهمان مجاز نباشند عدد آن 0 است.",
                  },
                  created_at: { type: "string" },
                  started_at: { type: "string" },
                  start_time: { type: "string" },
                  end_time: { type: "string" },
                  login_info: {
                    type: "object",
                    properties: {
                      username: { type: "string" },
                      password: { type: "string" },
                    },
                  },
                },
              },
            },
            3: {
              type: "array",
              items: {
                properties: {
                  id: { type: "integer", example: 1 },
                  is_owner: { type: "boolean", example: false },
                  title: { type: "string" },
                  description: { type: "string" },
                  type: {
                    type: "string",
                    example: "private, public",
                  },
                  tag: { type: "string" },
                  event_link: { type: "string" },
                  status: {
                    type: "string",
                    example: "وضعیت به 2 حالت ثبت میشود: active, inactive,",
                  },
                  proceeding: { type: "string", example: "متن صورتجلسه" },
                  guest_access: {
                    type: "string",
                    example:
                      "اگر مقدار 1 داشته باشد یعنی کاربران مهمان اجازه دسترسی به وبینار را دارند.",
                  },
                  guest_count: {
                    type: "integer",
                    example:
                      "در صورتیکه کاربران مهمان مجاز به شرکت در وبینار باشد عدد آن بیشتر از 0 است و اگر کاربران مهمان مجاز نباشند عدد آن 0 است.",
                  },
                  created_at: { type: "string" },
                  started_at: { type: "string" },
                  start_time: { type: "string" },
                  end_time: { type: "string" },
                  login_info: {
                    type: "object",
                    properties: {
                      username: { type: "string" },
                      password: { type: "string" },
                    },
                  },
                },
              },
            },
            4: {
              type: "array",
              items: {
                properties: {
                  id: { type: "integer", example: 1 },
                  is_owner: { type: "boolean", example: false },
                  title: { type: "string" },
                  description: { type: "string" },
                  type: {
                    type: "string",
                    example: "private, public",
                  },
                  tag: { type: "string" },
                  event_link: { type: "string" },
                  status: {
                    type: "string",
                    example: "وضعیت به 2 حالت ثبت میشود: active, inactive,",
                  },
                  proceeding: { type: "string", example: "متن صورتجلسه" },
                  guest_access: {
                    type: "string",
                    example:
                      "اگر مقدار 1 داشته باشد یعنی کاربران مهمان اجازه دسترسی به وبینار را دارند.",
                  },
                  guest_count: {
                    type: "integer",
                    example:
                      "در صورتیکه کاربران مهمان مجاز به شرکت در وبینار باشد عدد آن بیشتر از 0 است و اگر کاربران مهمان مجاز نباشند عدد آن 0 است.",
                  },
                  created_at: { type: "string" },
                  started_at: { type: "string" },
                  start_time: { type: "string" },
                  end_time: { type: "string" },
                  login_info: {
                    type: "object",
                    properties: {
                      username: { type: "string" },
                      password: { type: "string" },
                    },
                  },
                },
              },
            },
            5: {
              type: "array",
              items: {
                properties: {
                  id: { type: "integer", example: 1 },
                  is_owner: { type: "boolean", example: false },
                  title: { type: "string" },
                  description: { type: "string" },
                  type: {
                    type: "string",
                    example: "private, public",
                  },
                  tag: { type: "string" },
                  event_link: { type: "string" },
                  status: {
                    type: "string",
                    example: "وضعیت به 2 حالت ثبت میشود: active, inactive,",
                  },
                  proceeding: { type: "string", example: "متن صورتجلسه" },
                  guest_access: {
                    type: "string",
                    example:
                      "اگر مقدار 1 داشته باشد یعنی کاربران مهمان اجازه دسترسی به وبینار را دارند.",
                  },
                  guest_count: {
                    type: "integer",
                    example:
                      "در صورتیکه کاربران مهمان مجاز به شرکت در وبینار باشد عدد آن بیشتر از 0 است و اگر کاربران مهمان مجاز نباشند عدد آن 0 است.",
                  },
                  created_at: { type: "string" },
                  started_at: { type: "string" },
                  start_time: { type: "string" },
                  end_time: { type: "string" },
                  login_info: {
                    type: "object",
                    properties: {
                      username: { type: "string" },
                      password: { type: "string" },
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
  @ApiQuery({ type: ClientWebinarsDto })
  @Get("/user")
  async findAllMyWebinars(
    @Query() query: any,
    @Request() req: any,
    @Res() res: Response
  ) {
    console.log("*** Get Webinar/user ***");

    query.client_id = req.user.id;

    /*     await this.CustomRateLimitRequest(
      req,
      "get",
      "webinar/user",
      query.client_id,
      {
        year: query.year,
        page: 1,
        per_page: 25,
      }
    ); */

    const result = await this.weninarService.findAllMyWebinars(query);
    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    }

    return this.responsehandler.send(
      res,
      200,
      "لیست وبینارهای کاربر در دسترس است.",
      result.data.presentedWebinars
    );
  }

  private async CustomRateLimitRequest(
    req: any,
    method: string,
    route: string,
    client_id: string,
    params: {}
  ) {
    console.log("*** CustomRateLimitRequest ***");

    const ip = this.getUserIP(req);
    const key = this.generateCacheKey(ip, method, route, client_id, params);

    console.log({ key });

    const rateLimit = await this.cacheManager.get(key);
    if (!rateLimit) {
      await this.cacheManager.set(key, { created_at: new Date(Date.now()) });
    } else {
      throw new tooManyRequestErrorHandler();
    }
  }

  private getUserIP(req: any) {
    return (
      (req.headers["x-forwarded-for"] as string) ||
      (req.socket.remoteAddress as string)
    );
  }

  private generateCacheKey(
    ip: string,
    method: string,
    route: string,
    client_id: string,
    params: {}
  ) {
    const paramsKeys = Object.keys(params);
    const paramsList = paramsKeys
      .map((param) => param + "_" + params[param])
      .join("_");

    return `${method}/${route}___client_id_${client_id}_${paramsList}__ip_address_${ip}`;
  }

  // لیست کاربران دعوت شده به وبینار در دسترس است.
  @ApiOperation({
    summary: " لیست کاربران دعوت شده به وبینار",
    description: "دریافت لیست کاربران دعوت شده به وبینار",
  })
  @ApiConsumes("multipart/form-data")

  // ok response
  @ApiOkResponse({
    description: "لیست کاربران دعوت شده به وبینار در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "لیست کاربران دعوت شده به وبینار در دسترس است.",
        },
        error: { type: "string" },
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              client_id: { type: "integer", example: 12 },
              userid: { type: "integer", example: 12 },
              display_name: {
                type: "strint",
                example: "پوریا میرخباز",
              },
              phone: { type: "string", example: "09183372684" },
              role: { type: "string", example: "teacher" },
            },
          },
        },
      },
    },
  })
  @Get("/members")
  async findInvitedWebinars(
    @Query() query: InvitedClientsIntoWebinarDto,
    @Request() req: any,
    @Res() res: Response
  ) {
    const data = await this.weninarService.findInvitedWebinars(
      query.webinar_id
    );

    const webinarTransformer = this.webinarTransformer.guestCollection(data);
    return this.responsehandler.send(
      res,
      200,
      "لیست کاربران دعوت شده به وبینار در دسترس است.",
      webinarTransformer
    );
  }

  // ثبت صورتجلسه برای یک وبینار
  @ApiCreatedResponse({
    description: "صورتجلسه با موفقیت ذخیره شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 201 },
        message: {
          type: "string",
          example: "صورتجلسه با موفقیت ذخیره شد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {},
        },
      },
    },
  })
  @ApiOperation({
    summary: "ثبت صورتجلسه برای وبینار",
    description:
      "برای ثبت و ویرایش صورتجلسه میتوان از این \n\n API \n\n استفاده کرد.",
  })
  @ApiBody({ type: SaveProceedingDto })
  @ApiConsumes("multipart/form-data")
  @Post("/proceeding")
  @FormDataRequest()
  async saveProceeding(
    @Body() saveProceeding: SaveProceedingDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    saveProceeding.user_id = req.user.id;
    const result = await this.weninarService.saveProceeding(saveProceeding);
    if (!result) {
      throw new InternalServerErrorSchema();
    }

    return this.responsehandler.send(res, 201, "صورتجلسه با موفقیت ذخیره شد.");
  }

  // حذف وبینار
  @ApiOkResponse({
    description: "وبینار موردنظر با موفقیت حذف شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "وبینار موردنظر با موفقیت حذف شد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {},
        },
      },
    },
  })
  @ApiOperation({ summary: "حذف وبینار" })
  @Delete(":webinar_id")
  async deleteWebinar(
    @Param() deleteWebinarDto: DeleteWebinarDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    deleteWebinarDto.user_id = req.user.id;
    const result = await this.weninarService.deleteWebinar(deleteWebinarDto);

    if (result.status === 500) {
      throw new InternalServerErrorSchema();
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    }

    return this.responsehandler.send(
      res,
      200,
      "وبینار موردنظر با موفقیت حذف شد."
    );
  }

  // غیرفعال کردن وبینار
  @ApiOkResponse({
    description: "وبینار موردنظر با موفقیت غیرفعال شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "وبینار موردنظر با موفقیت غیرفعال شد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {},
        },
      },
    },
  })
  @ApiOperation({ summary: "غیرفعال کردن وبینار" })
  @Delete("/inactive/:webinar_id")
  async inActive(
    @Param() deleteWebinarDto: DeleteWebinarDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    deleteWebinarDto.user_id = req.user.id;
    const result = await this.weninarService.webinarStatusInactived(
      deleteWebinarDto
    );

    if (result.status === 500) {
      throw new InternalServerErrorSchema();
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    }

    return this.responsehandler.send(
      res,
      200,
      "وبینار موردنظر با موفقیت غیرفعال شد."
    );
  }

  // ویرایش وبینار
  @ApiOkResponse({
    description: "وبینار با موفقیت ویرایش شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "وبینار با موفقیت ویرایش شد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            is_owner: { type: "boolean", example: false },
            title: { type: "string" },
            description: { type: "string" },
            type: {
              type: "string",
              example: "نوع وبنیار: private, public",
            },
            tag: { type: "string" },
            event_link: { type: "string" },
            status: {
              type: "string",
              example: "وضعیت به 2 حالت ثبت میشود: active, inactive,",
            },
            proceeding: { type: "string", example: "متن صورتجلسه" },
            guest_access: {
              type: "string",
              example:
                "اگر مقدار 1 داشته باشد یعنی کاربران مهمان اجازه دسترسی به وبینار را دارند.",
            },
            guest_count: {
              type: "integer",
              example:
                "در صورتیکه کاربران مهمان مجاز به شرکت در وبینار باشد عدد آن بیشتر از 0 است و اگر کاربران مهمان مجاز نباشند عدد آن 0 است.",
            },
            created_at: { type: "string" },
            started_at: { type: "string" },
            start_time: { type: "string" },
            end_time: { type: "string" },
            login_info: {
              type: "object",
              properties: {
                username: { type: "string" },
                password: { type: "string" },
              },
            },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: "ویرایش وبینار" })
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  @Patch()
  async updateWbinar(
    @Body() updateWebinarDto: UpdateWebinarDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    updateWebinarDto.user_id = req.user.id;
    const result = await this.weninarService.updateWebinar(updateWebinarDto);

    if (result.status === 500) {
      throw new InternalServerErrorSchema();
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    }

    const transformer = this.webinarTransformer.transform(
      result.webinar,
      result.client
    );
    return this.responsehandler.send(
      res,
      200,
      "وبینار موردنظر با موفقیت حذف شد.",
      transformer
    );
  }

  // افزودن مخاطبین به وبینار
  @ApiOperation({
    summary: "افزودن مخاطبین به وبینار",
    description: "مخاطبین خود را به وبینار دعوت کنید.",
  })
  @ApiOkResponse({
    description: "مخاطبین شما به وبینار اضافه شدند.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "مخاطبین شما به وبینار اضافه شدند.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {},
        },
      },
    },
  })
  @Post("/invite")
  async inviteContactToWebinar(
    @Body() inviteContactDto: InviteContactDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    inviteContactDto.user_id = req.user.id;
    console.log("*** invite ***");
    console.log(inviteContactDto);
    const result = await this.weninarService.inviteContactToWebinar(
      inviteContactDto
    );
    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    }
    if (result.status === 500) {
      throw new InternalServerErrorSchema();
    }

    return this.responsehandler.send(
      res,
      200,
      "مخاطبین شما به وبینار اضافه شدند."
    );
  }
}
