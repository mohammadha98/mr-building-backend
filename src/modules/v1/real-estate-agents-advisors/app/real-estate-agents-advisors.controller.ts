import { DeleteFilteredWordAdvisorDto } from "./dto/delete-filtered-word-advisor.dto";
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  Request,
  Response,
  Query,
} from "@nestjs/common";
import { RealEstateAgentsAdvisorsService } from "./real-estate-agents-advisors.service";
import {
  CreateRealEstateAgentsAdvisorDto,
  UpdatePermissionsForAdvisorDto,
} from "./dto/create-real-estate-agents-advisor.dto";
import {
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/modules/v1/jwt-auth/jwt-auth.guard";
import { ValidateRealEstateAgentsAdvisorDto } from "./dto/validate-real-estate-agents-advisor.dto";
import { ForbiddenErrorHandler } from "src/modules/services/httpResponseHandler/forbiddenErrorHandler";
import { BadRequestErrorHandler } from "src/modules/services/httpResponseHandler/badRequestErrorHandler";
import { InternalServerErrorHandler } from "src/modules/services/httpResponseHandler/internalServerErrorHandler";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { FormDataRequest } from "nestjs-form-data";
import ClientTransformer from "src/modules/v1/client/app/Transformer";
import { GetRealEstateAgentsAdvisorsDto } from "./dto/get-real-estate-agents-advisors.dto";
import RealEstateAdvisorTransformer from "./Transformer";
import { ChangeStatusRealEstateAgentsAdvisorsDto } from "./dto/change-status-real-estate-agents-advisors.dto";
import { DeleteRealEstateAgentsAdvisorsDto } from "./dto/delete-real-estate-agents-advisors.dto";
import { CreateActiveAreaAdvisorDto } from "./dto/create-active-area-advisor.dto";
import { DeleteActiveAreaAdvisorDto } from "./dto/delete-active-area-advisor.dto";
import { GetActiveAreasAdvisorDto } from "./dto/get-active-areas-advisor.dto";
import { CreateAdvisorCommentDto } from "./dto/create-advisor-comment.dto";
import { GetAdvisorCommentsDto } from "./dto/get-advisor-comments..dto";
import { SaveAdvisorSettingDto } from "./dto/save-advisor-settings..dto";
import { UpdateAdvisorProfileDto } from "./dto/update-profile.dto";
import { DeleteCommentDto } from "../../real-estate-agents-comments/app/dto/update-real-estate-agents-comment.dto";

@UseGuards(JwtAuthGuard)
@ApiSecurity("JWT-auth")
@ApiTags("v1/app/real-estate-agents-advisors")
@Controller("v1/app/real-estate-agents-advisors")
export class RealEstateAgentsAdvisorsController {
  constructor(
    private readonly responseHandler: HttpResponsehandler,
    private readonly realEstateAdvisorTransformer: RealEstateAdvisorTransformer,
    private readonly clientTransformer: ClientTransformer,
    private readonly realEstateAgentsAdvisorsService: RealEstateAgentsAdvisorsService
  ) {}

  // بررسی شماره کارشناس
  // ok response
  @ApiOkResponse({
    description: "ریسپانس در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "ریسپانس در دسترس است.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "estate_agent, not_found, busy, free",
            },
            client_info: {
              type: "object",
              properties: {
                id: { type: "integer", example: 1 },
                provider_id: { type: "integer", example: 1 },
                name: { type: "string", example: "" },
                surname: { type: "string", example: "" },
                phone: { type: "string", example: "09120000000" },
                avatar: { type: "string", example: "" },
              },
            },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: "بررسی شماره کارشناس" })
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  @Post("/validate")
  async validate(
    @Body() body: ValidateRealEstateAgentsAdvisorDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.client_id = req.user.id;

    // TODO: log RealEstateAgentsAdvisor: validate
    console.log("*** RealEstateAgentsAdvisor: validate ***");
    console.log(body);

    const result = await this.realEstateAgentsAdvisorsService.validate(body);
    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    const transformer = this.clientTransformer.transform(result.user);

    return this.responseHandler.send(res, 200, "ریسپانس در دسترس است.", {
      status: result.result,
      client_info: transformer,
    });
  }

  // افزودن کارشناس به مشاور املاک
  // ok response
  @ApiOkResponse({
    description: "افزودن کارشناس انجام نشد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "افزودن کارشناس انجام نشد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "estate_agent, not_found, busy",
            },
          },
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: "کارشناس با موفقیت اضافه شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 201 },
        message: {
          type: "string",
          example: "کارشناس با موفقیت اضافه شد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "created",
            },
            advisor: {
              type: "object",
              properties: {
                id: { type: "integer" },
              },
            },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: "افزودن کارشناس به مشاوراملاک" })
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  @Post()
  async create(
    @Body() body: CreateRealEstateAgentsAdvisorDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.client_id = req.user.id;

    // TODO: log RealEstateAgentsAdvisor: create
    console.log("*** RealEstateAgentsAdvisor: create ***");
    console.log(body);

    const result = await this.realEstateAgentsAdvisorsService.create(body);
    if (result.status === 200) {
      return this.responseHandler.send(
        res,
        200,
        "کارشناس موردنظر اضافه نشد. برای بررسی دلیل به جزییات ریسپانس مراجعه کنید.",
        {
          status: result.result,
        }
      );
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }
    return this.responseHandler.send(res, 201, "کارشناس با موفقیت اضافه شد.", {
      status: result.result,
      advisor: result.advisor,
    });
  }

  @Patch("update-permissions")
  @ApiOperation({ summary: "ویرایش دسترسی کارشناس" })
  async updatePermissions(@Body() body: UpdatePermissionsForAdvisorDto) {
    // TODO: log RealEstateAgentsAdvisor: create
    console.log("*** updatePermissions Advisor  ***");
    console.log(body);

    return await this.realEstateAgentsAdvisorsService.updatePermissions(body);
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
  @Get()
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

  // تغییر وضعیت کارشناس
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
  @ApiOperation({ summary: "تغییر وضعیت کارشناس" })
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  @Patch()
  async changeStatus(
    @Body() body: ChangeStatusRealEstateAgentsAdvisorsDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    console.log("*** RealEstateAgentsAdvisor: change status ***");
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

  // حذف کارشناس
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
  @ApiOperation({ summary: "حذف کارشناس" })
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  @Delete()
  async removeAdvisor(
    @Body() body: DeleteRealEstateAgentsAdvisorsDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.client_id = req.user.id;
    console.log("*** RealEstateAgentsAdvisor: removeAdvisor ***");
    console.log(body);

    const result = await this.realEstateAgentsAdvisorsService.removeAdvisor(
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

  // افزودن محدوده فعالیت کارشناس
  @ApiCreatedResponse({
    description: "محدوده موردنظر با موفقیت ذخیره شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 201 },
        message: {
          type: "string",
          example: "محدوده موردنظر با موفقیت ذخیره شد.",
        },
        error: { type: "string" },
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: {
                type: "integer",
                example: 1,
              },
              title: {
                type: "string",
              },
            },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: "افزودن محدوده فعالیت کارشناس" })
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  @Post("/active_areas")
  async storeActiveArea(
    @Body() body: CreateActiveAreaAdvisorDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.client_id = req.user.id;

    // TODO: log RealEstateAgentsAdvisor: validate
    console.log("*** RealEstateAgentsAdvisor: storeActiveArea ***");
    console.log(body);

    const result = await this.realEstateAgentsAdvisorsService.storeActiveArea(
      body
    );
    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    const transformer = this.realEstateAdvisorTransformer.collectionActiveArea(
      result.active_areas
    );

    return this.responseHandler.send(
      res,
      200,
      "محدوده موردنظر با موفقیت ذخیره شد.",
      transformer
    );
  }

  // حذف محدوده فعالیت
  @ApiOkResponse({
    description: "آیتم مورد نظر با موفقیت حذف شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "آیتم مورد نظر با موفقیت حذف شد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {},
        },
      },
    },
  })
  @ApiOperation({ summary: "حذف محدوده فعالیت" })
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  @Delete("/active_areas")
  async removeActiveArea(
    @Body() body: DeleteActiveAreaAdvisorDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.client_id = req.user.id;
    console.log("*** RealEstateAgentsAdvisor: removeActiveArea ***");
    console.log(body);

    const result = await this.realEstateAgentsAdvisorsService.removeActiveArea(
      body
    );

    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    return this.responseHandler.send(
      res,
      200,
      "آیتم مورد نظر با موفقیت حذف شد."
    );
  }

  // دریافت محدوده های فعالیت کارشناس
  @ApiOkResponse({
    description: "لیست محدوده ها در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "لیست محدوده ها در دسترس است.",
        },
        error: { type: "string" },
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: {
                type: "integer",
                example: 1,
              },
              title: {
                type: "string",
              },
            },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: "دریافت محدوده های فعالیت کارشناس" })
  @Get("/active_areas")
  async getActiveAreas(
    @Query() query: GetActiveAreasAdvisorDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    query.client_id = req.user.id;
    console.log("*** RealEstateAgentsAdvisor: getActiveAreas ***");
    console.log(query);

    const result = await this.realEstateAgentsAdvisorsService.getActiveAreas(
      query
    );

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. کارشناس مورد نظر موجود نمیباشد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }
    const transformer = this.realEstateAdvisorTransformer.collectionActiveArea(
      result.result
    );

    return this.responseHandler.send(
      res,
      200,
      "لیست محدوده ها در دسترس است.",
      transformer
    );
  }

  // افزودن کلمات فیلتر شده توسط کارشناس
  @ApiCreatedResponse({
    description: "فیلتر کلمات جدید با موفقیت ذخیره شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 201 },
        message: {
          type: "string",
          example: "فیلتر کلمات جدید با موفقیت ذخیره شد.",
        },
        error: { type: "string" },
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: {
                type: "integer",
                example: 1,
              },
              title: {
                type: "string",
              },
            },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: "افزودن کلمات فیلتر شده توسط کارشناس" })
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  @Post("/filtered_words")
  async storeFilteredWord(
    @Body() body: CreateActiveAreaAdvisorDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.client_id = req.user.id;

    // TODO: log RealEstateAgentsAdvisor: storeFilteredWord
    console.log("*** RealEstateAgentsAdvisor: storeFilteredWord ***");
    console.log(body);

    const result = await this.realEstateAgentsAdvisorsService.storeFilteredWord(
      body
    );
    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    const transformer =
      this.realEstateAdvisorTransformer.collectionFilteredWord(
        result.filtered_words
      );

    return this.responseHandler.send(
      res,
      200,
      "فیلتر کلمات جدید با موفقیت ذخیره شد.",
      transformer
    );
  }

  // حذف  کلمه فیلتر شده
  @ApiOkResponse({
    description: "آیتم مورد نظر با موفقیت حذف شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "آیتم مورد نظر با موفقیت حذف شد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {},
        },
      },
    },
  })
  @ApiOperation({ summary: "حذف  کلمه فیلتر شده" })
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  @Delete("/filtered_words")
  async removeFilteredWord(
    @Body() body: DeleteFilteredWordAdvisorDto,
    @Request() req: any,
    @Response() res: Response
  ): Promise<any> {
    body.client_id = req.user.id;
    console.log("*** RealEstateAgentsAdvisor: removeFilteredWord ***");
    console.log(body);

    const result =
      await this.realEstateAgentsAdvisorsService.removeFilteredWord(body);

    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    return this.responseHandler.send(
      res,
      200,
      "آیتم مورد نظر با موفقیت حذف شد."
    );
  }

  // دریافت محدوده های فعالیت کارشناس
  @ApiOkResponse({
    description: "لیست کلمات فیلتر شده کارشناس در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "لیست کلمات فیلتر شده کارشناس در دسترس است.",
        },
        error: { type: "string" },
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: {
                type: "integer",
                example: 1,
              },
              title: {
                type: "string",
              },
            },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: "لیست کلمات فیلتر شده کارشناس   ." })
  @Get("/filtered_words")
  async getFilteredWords(
    @Query() query: GetActiveAreasAdvisorDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    query.client_id = req.user.id;
    console.log("*** RealEstateAgentsAdvisor: getActiveAreas ***");
    console.log(query);

    const result = await this.realEstateAgentsAdvisorsService.getFilteredWords(
      query
    );

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. کارشناس مورد نظر موجود نمیباشد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }
    const transformer = this.realEstateAdvisorTransformer.collectionActiveArea(
      result.result
    );

    return this.responseHandler.send(
      res,
      200,
      "لیست کلمات فیلتر شده کارشناس در دسترس است.",
      transformer
    );
  }

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
            result: {
              type: "object",
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
            is_blocked: { type: "boolean", example: false },
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
            result: {
              type: "object",
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
            is_blocked: { type: "boolean", example: false },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: "ثبت نظر برای کارشناس" })
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  @Post("comments")
  async storeComment(
    @Body() body: CreateAdvisorCommentDto,
    @Request() req: any,
    @Response() res: any
  ) {
    body.client_id = req.user.id;
    const result = await this.realEstateAgentsAdvisorsService.storeComment(
      body
    );

    if (result.status === 200) {
      const transformer = this.realEstateAdvisorTransformer.transformComments(
        result.result
      );

      return this.responseHandler.send(
        res,
        200,
        "نظر شما در سیستم موجود میباشد.",
        {
          result: transformer,
          is_blocked: result.is_blocked,
        }
      );
    } else if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. کارشناس موردنظر وجود ندارد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    const transformer = this.realEstateAdvisorTransformer.transformComments(
      result.result
    );
    return this.responseHandler.send(
      res,
      201,
      "نظر شما با موفقیت ثبت شد. بعد از بررسی و تایید منتشر میشود.",
      {
        result: transformer,
        is_blocked: result.is_blocked,
      }
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
  @ApiOperation({ summary: "لیست نظرات کارشناس" })
  @Get("comments")
  async findComments(
    @Query() query: GetAdvisorCommentsDto,
    @Request() req: any,
    @Response() res: any
  ) {
    query.client_id = req.user.id;
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

    const transformer = this.realEstateAdvisorTransformer.collectionComments(
      result.result
    );

    const user_comment = this.realEstateAdvisorTransformer.transformComments(
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
    return this.realEstateAgentsAdvisorsService.deleteCommentForAdvisor(query);
  }

  // ذخیره تنظیمات کارشناس
  @ApiOkResponse({
    description: "تنظیمات کارشناس با موفقیت تغییر کرد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "تنظیمات کارشناس با موفقیت تغییر کرد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {},
        },
      },
    },
  })
  @ApiOperation({ summary: "ذخیره تنظیمات کارشناس" })
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  @Post("settings")
  async saveSettings(
    @Body() body: SaveAdvisorSettingDto,
    @Request() req: any,
    @Response() res: any
  ) {
    body.client_id = req.user.id;
    console.log("*** change advisor dashboard settings ***");
    console.log(body);

    const result = await this.realEstateAgentsAdvisorsService.saveSettings(
      body
    );
    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. کارشناس موردنظر وجود ندارد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    return this.responseHandler.send(
      res,
      200,
      "تنظیمات کارشناس با موفقیت تغییر کرد."
    );
  }

  // بروزرسانی بیوگرافی
  @ApiOkResponse({
    description: "تنظیمات کارشناس با موفقیت تغییر کرد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "تنظیمات کارشناس با موفقیت تغییر کرد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {},
        },
      },
    },
  })
  @ApiOperation({ summary: "بروزرسانی بیوگرافی" })
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  @Post("profile")
  async updateProfile(
    @Body() body: UpdateAdvisorProfileDto,
    @Request() req: any,
    @Response() res: any
  ) {
    body.client_id = req.user.id;
    console.log("*** Update Advisor ***");
    console.log(body);

    const result = await this.realEstateAgentsAdvisorsService.updateProfile(
      body
    );
    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. کارشناس موردنظر وجود ندارد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    return this.responseHandler.send(res, 200, "بروزرسانی با موفقیت انجام شد.");
  }
}
