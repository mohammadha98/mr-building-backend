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
  InternalServerErrorException,
  UseInterceptors,
  UploadedFile,
  Param,
} from "@nestjs/common";

import { RealEstateAdsServiceApp } from "./real-estate-ads-service-app.service";
import { CreateRealEstateAdDto } from "./dto/create-real-estate-ads.dto";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  getSchemaPath,
} from "@nestjs/swagger";
import { ForbiddenErrorHandler } from "src/modules/services/httpResponseHandler/forbiddenErrorHandler";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { GetDetailsRealEstateAdItemsDto } from "./dto/get-details-real-estate-ads.dto";
import RealEstateAdsTransformer from "./Transformer";
import { parse, join } from "path";
import { randomBytes } from "crypto";
import { UploadFileRealEstateAdItemsDto } from "./dto/upload-file-real-estate-ads.dto";
import { FormDataRequest } from "nestjs-form-data";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { BadRequestErrorHandler } from "src/modules/services/httpResponseHandler/badRequestErrorHandler";
import BadRequestSchema from "src/commons/contracts/swaggerDefinations/BadRequestSchema";
import { GetRealEstateAdDto } from "./dto/get-real-estate-ads.dto";
import { FilteredDto } from "./dto/filtered.dto";
import { DeleteRealEstateAdItemsDto } from "./dto/delete-real-estate-ads.dto";
import { DeleteRealEstateMediaItemDto } from "./dto/delete-media-item.dto";
import {
  UpdateExpiredAd,
  UpdateRealEstateAdDto,
} from "./dto/update-real-estate-ads.dto";
import { ChangeCoverMediaDto } from "./dto/change-cover-media-item.dto";
import { GetPublicAdsDto } from "./dto/get-public-ads";
import { APP_ChangeStatusAdDto } from "./dto/change-status-ad.dto";
import { SwaggerConsumes } from "src/commons/enums/swagger.consumes";
import { SaveAdSettingsDto } from "./dto/save-ad-settings";
import TokenAuthGuardClient from "src/modules/v2/jwt-auth/TokenAuthGuardClient";
import { saveNewSuspiciousBehavior } from "./dto/save-suspicious-behavior-ad";
import { EstimatePriceAd } from "./dto/estimate-price-ad";

@UseGuards(TokenAuthGuardClient)
@ApiSecurity("JWT-auth")
@ApiTags("v2/app-real-estate-ads")
@Controller("v2/app/real-estate-ads")
export class RealEstateAdsSettingsController {
  constructor(
    private readonly realEstateAdsService: RealEstateAdsServiceApp,
    private readonly responseHandler: HttpResponsehandler,
    private readonly realEstateAdsTransformer: RealEstateAdsTransformer
  ) {}

  // ایجاد آگهی
  @ApiCreatedResponse({
    description: "آگهی جدید ثبت شد. بعد بررسی و تایید منتشر خواهد شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 201 },
        message: {
          type: "string",
          example: "آگهی جدید ثبت شد. بعد بررسی و تایید منتشر خواهد شد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
          },
        },
      },
    },
  })
  @Post()
  @ApiOperation({ summary: "ایجاد آگهی" })
  async create(
    @Body() body: CreateRealEstateAdDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.client_id = req.client.id;

    console.log("*** CreateRealEstateAdDto ***");
    console.log({ body });

    const result = await this.realEstateAdsService.storeAd(body);

    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorException();
    }

    return this.responseHandler.send(
      res,
      201,
      "آگهی جدید ثبت شد. بعد بررسی و تایید منتشر خواهد شد.",
      { id: result.result.id }
    );
  }

  // ویرایش آگهی
  @ApiCreatedResponse({
    description: "ویرایش آگهی انجام شد. بعد از تایید منتشر میشود.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 201 },
        message: {
          type: "string",
          example: "ویرایش آگهی انجام شد. بعد از تایید منتشر میشود.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
          },
        },
      },
    },
  })
  @Patch()
  @ApiOperation({ summary: "ویرایش آگهی" })
  async update(
    @Body() body: UpdateRealEstateAdDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.client_id = req.client.id;

    console.log("*** UpdateRealEstateAdDto ***");
    console.log({ body });

    const result = await this.realEstateAdsService.update(body);

    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorException();
    }

    return this.responseHandler.send(
      res,
      201,
      "ویرایش آگهی انجام شد. بعد از تایید منتشر میشود.",
      { id: result.result.id }
    );
  }

  // دریافت آگهی ها
  // آگهی های من
  // لیست آگهی ها بر اساس: اسات - شهر - جدیدترین - قدیمی ترین - ارزان ترین - گران ترین
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
                  category: {
                    type: "object",
                    properties: {
                      id: { type: "integer", example: 1 },
                      title: { type: "String" },
                      type: {
                        type: "String",
                        example: "sale, rent, participation, short_rent",
                      },
                    },
                  },
                  sub_category: {
                    type: "object",
                    properties: {
                      id: { type: "integer", example: 1 },
                      title: { type: "String" },
                    },
                  },
                  sale_price: { type: "String" },
                  deposit_price: { type: "String" },
                  rent_price: { type: "String" },
                  number_of_rooms: { type: "String" },
                  max_capicity: { type: "String" },
                  normal_days_price: { type: "String" },
                  title: { type: "String" },
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
                  owner_info: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      avatar: { type: "string" },
                    },
                  },
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
  @Get()
  async findAds(
    @Query() query: GetRealEstateAdDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    query.client_id = req.client.id;

    const result = await this.realEstateAdsService.findAds(query);

    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorException();
    }

    return this.responseHandler.send(res, 200, "لیست آگهی ها در دسترس است.", {
      data: result.result,
      metadata: result.metadata,
    });
  }

  // فیلتر آگهی ها
  @ApiOkResponse({
    description: "آگهی های فیلتر شده در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "آگهی های فیلتر شده در دسترس است.",
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
                  category: {
                    type: "object",
                    properties: {
                      id: { type: "integer", example: 1 },
                      title: { type: "String" },
                      type: {
                        type: "String",
                        example: "sale, rent, participation, short_rent",
                      },
                    },
                  },
                  sub_category: {
                    type: "object",
                    properties: {
                      id: { type: "integer", example: 1 },
                      title: { type: "String" },
                    },
                  },
                  sale_price: { type: "String" },
                  deposit_price: { type: "String" },
                  rent_price: { type: "String" },
                  number_of_rooms: { type: "String" },
                  max_capicity: { type: "String" },
                  normal_days_price: { type: "String" },
                  title: { type: "String" },
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
  @ApiOperation({ summary: "فیلتر آگهی ها" })
  @Post("filter")
  async filteredAds(
    @Body() body: FilteredDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.client_id = req.client.id;

    // TODO test log
    console.log("*** filteredAds ***");
    console.log({ body });

    const result = await this.realEstateAdsService.filteredAds(body);

    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorException();
    }

    const transformer = this.realEstateAdsTransformer.collectionAdList(
      result.result
    );
    return this.responseHandler.send(
      res,
      200,
      "آگهی های فیلتر شده در دسترس است.",
      {
        data: transformer,
        metadata: result.metadata,
      }
    );
  }

  // جزییات آگهی
  @ApiOkResponse({
    description: "جزییات آگهی درخواستی در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "جزییات آگهی درخواستی در دسترس است.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            details: {
              type: "object",
              properties: {
                id: { type: "integer", example: 1 },
                tracking_code: { type: "String" },
                seller_type: {
                  type: "String",
                  example: "individual || real_estate_agent || advisor",
                },
                owner_id: { type: "integer", example: 1 },
                title: { type: "String" },
                description: { type: "String" },
                category: {
                  type: "object",
                  properties: {
                    id: { type: "integer", example: 1 },
                    title: { type: "String" },
                    type: {
                      type: "String",
                      example: "sale, rent, participation, short_rent",
                    },
                  },
                },
                sub_category: {
                  type: "object",
                  properties: {
                    id: { type: "integer", example: 1 },
                    title: { type: "String" },
                  },
                },
                sale_price: { type: "String" },
                deposit_price: { type: "String" },
                rent_price: { type: "String" },
                number_of_rooms: { type: "String" },
                max_capicity: { type: "String" },
                size: { type: "integer" },
                year_built: { type: "integer" },
                normal_days_price: { type: "integer" },
                weekend_price: { type: "integer" },
                special_days_price: { type: "integer" },
                cost_per_additional_person: { type: "integer" },
                extra_people: { type: "integer" },
                latitude: { type: "number" },
                longitude: { type: "number" },
                prepaid_price: { type: "String" },
                agent_valuation_request: { type: "Boolean", example: false },
                price_status: { type: "String", example: "fair, high, low" },
                price_rating: { type: "number", example: "1-5" },
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
                owner_info: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    avatar: { type: "string" },
                  },
                },
                items: {
                  type: "array",
                  items: {
                    properties: {
                      id: { type: "number", example: 1 },
                      item_id: { type: "number", example: 1 },
                      field_type: { type: "string" },
                      field_name: { type: "string" },
                      value: { type: "string" },
                      icon: { type: "string" },
                    },
                  },
                },
                media: {
                  type: "array",
                  items: {
                    properties: {
                      id: { type: "number", example: 1 },
                      file_name: { type: "string" },
                      file_type: { type: "string", example: "image, video" },
                      file_url: { type: "string" },
                      sort_number: { type: "string" },
                      priority: { type: "string", example: "primary, normal" },
                    },
                  },
                },
                created_at: { type: "String" },
              },
            },
            related: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "integer", example: 1 },
                  category: {
                    type: "object",
                    properties: {
                      id: { type: "integer", example: 1 },
                      title: { type: "String" },
                      type: {
                        type: "String",
                        example: "sale, rent, participation, short_rent",
                      },
                    },
                  },
                  sub_category: {
                    type: "object",
                    properties: {
                      id: { type: "integer", example: 1 },
                      title: { type: "String" },
                    },
                  },
                  sale_price: { type: "String" },
                  deposit_price: { type: "String" },
                  rent_price: { type: "String" },
                  number_of_rooms: { type: "String" },
                  max_capicity: { type: "String" },
                  normal_days_price: { type: "String" },
                  title: { type: "String" },
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
                  owner_info: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      avatar: { type: "string" },
                    },
                  },
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
          },
        },
      },
    },
  })
  @ApiOperation({ summary: "جزییات آگهی" })
  @Get("details")
  async findDetails(
    @Query() query: GetDetailsRealEstateAdItemsDto,
    @Request() req: any
  ) {
    query.client_id = req.client.id;
    console.log({ query });

    return this.realEstateAdsService.findDetails(query);
  }

  // آپلودر
  @ApiCreatedResponse({
    description: "فایل مورد نظر با موفقیت آپلود شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 201 },
        message: {
          type: "string",
          example: "فایل مورد نظر با موفقیت آپلود شد.",
        },
        error: { type: "string" },
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              file_name: { type: "string" },
              file_url: { type: "string" },
              file_type: { type: "string", example: "image, video" },
              priority: { type: "string", example: "primary, normal" },
            },
          },
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./public/contents/temp/files/",
        filename(req, file, callback) {
          const uniqueCode = randomBytes(3).toString("hex").toUpperCase();
          const extension = parse(join(file.originalname)).ext;
          const filename = `${Date.now()}-${uniqueCode}${extension}`;

          callback(null, filename);
        },
      }),
    })
  )
  @ApiOperation({ summary: "آپلود فایل" })
  @Post("file")
  @ApiBody({ type: UploadFileRealEstateAdItemsDto })
  @ApiConsumes("multipart/form-data")
  async UploadTempFile(
    @Body() body: UploadFileRealEstateAdItemsDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
    @Response() res: any
  ) {
    console.log("*** UploadFile: RealEstate Ad ***");
    console.log({ file });

    body.file = file.filename;

    console.log({ body });

    return await this.realEstateAdsService.UploadFile(body, res);
  }

  @ApiOperation({ summary: "حذف آگهی" })
  @ApiConsumes(SwaggerConsumes.Json)
  @Delete()
  async removeAd(
    @Body() body: DeleteRealEstateAdItemsDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.client_id = req.client.id;
    console.log("*** Remove Ad ***");
    console.log(body);

    const result = await this.realEstateAdsService.removeAd(body);

    if (result.status === 400) {
      throw new BadRequestErrorHandler("فایل موردنظر موجود نمیباشد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorException();
    }

    return this.responseHandler.send(
      res,
      200,
      "آگهی موردنظر با موفقیت حذف شد."
    );
  }

  // حذف فایل آگهی
  @ApiOkResponse({
    description: "فایل موردنظر با موفقیت حذف شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "فایل موردنظر با موفقیت حذف شد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {},
        },
      },
    },
  })
  // BadRequest Response
  @ApiBadRequestResponse({
    description: "خطا. آیتم موردنظر موجود نمیباشد.",
    type: BadRequestSchema,
    schema: {
      $ref: getSchemaPath(BadRequestSchema),
    },
  })
  @ApiOperation({ summary: "حذف فایل " })
  @Delete("file")
  async removeAdFile(
    @Query() query: DeleteRealEstateMediaItemDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    query.client_id = req.client.id;

    console.log("*** removeAdFile ***");
    console.log(query);

    const result = await this.realEstateAdsService.removeAdFile(query);

    if (result.status === 400) {
      throw new BadRequestErrorHandler("فایل موردنظر موجود نمیباشد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorException();
    }

    return this.responseHandler.send(
      res,
      200,
      "فایل موردنظر با موفقیت حذف شد."
    );
  }

  // تغییر کاور آگهی
  @ApiOkResponse({
    description: "کاور با موفقیت انتخاب شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "کاور با موفقیت انتخاب شد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {},
        },
      },
    },
  })
  // BadRequest Response
  @ApiBadRequestResponse({
    description: "خطا. آیتم موردنظر موجود نمیباشد.",
    type: BadRequestSchema,
    schema: {
      $ref: getSchemaPath(BadRequestSchema),
    },
  })
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  @ApiOperation({ summary: "تغییر کاور آگهی" })
  @Post("/change_cover")
  async changeCover(
    @Body() body: ChangeCoverMediaDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.client_id = req.client.id;

    const result = await this.realEstateAdsService.changeCover(body);

    if (result.status === 400) {
      throw new BadRequestErrorHandler("آگهی موردنظر موجود نمیباشد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorException();
    }

    return this.responseHandler.send(res, 200, "کاور با موفقیت انتخاب شد.");
  }

  // تغییر وضعیت آگهی
  @ApiCreatedResponse({
    description: "وضعیت آگهی با موفقیت تغییر کرد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 201 },
        message: {
          type: "string",
          example: "وضعیت آگهی با موفقیت تغییر کرد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {},
        },
      },
    },
  })
  @ApiOperation({ summary: "تغییر وضعیت آگهی" })
  @Post("change-status")
  async changeStatus(
    @Body() body: APP_ChangeStatusAdDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.user_id = req.client.id;
    console.log("*** changeStatus Ad: agentADMIN ***");
    console.log(body);

    const result = await this.realEstateAdsService.changeStatus(body);

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. آیتم موردنظر موجود نمیباشد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorException();
    }

    return this.responseHandler.send(
      res,
      201,
      "وضعیت آگهی با موفقیت تغییر کرد."
    );
  }

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
  @ApiOperation({ summary: "دریافت آگهی های عمومی - اپراتورها" })
  @Post("/public")
  async GetPublicAdsDto(
    @Body() body: GetPublicAdsDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.client_id = req.client.id;

    console.log("*** GetPublicAdsDto ***");
    console.log(body);

    const result = await this.realEstateAdsService.getPublicAds(body);

    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorException();
    }

    return this.responseHandler.send(
      res,
      200,
      "لیست آگهی های عمومی در دسترس است.",
      {
        data: result.result,
        metadata: result.metadata,
      }
    );
  }

  // لیست دسته بندی
  @ApiOkResponse({
    description: "لیست دیته بندی ها در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "لیست دیته بندی ها در دسترس است.",
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
                  title: { type: "String" },
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "integer", example: 1 },
                        title: { type: "String" },
                        form: {
                          type: "object",
                          properties: {
                            items: {
                              type: "array",
                              items: {
                                type: "object",
                                properties: {
                                  id: { type: "integer", example: 1 },
                                  field_name: {
                                    type: "String",
                                    example: "field_name",
                                  },
                                  type: {
                                    type: "String",
                                    example:
                                      "sale, presell, collaboration, rent",
                                  },
                                  field_type: {
                                    type: "String",
                                    example:
                                      "input_string, input_number, list, toggle  ",
                                  },
                                  values: {
                                    type: "array",
                                    items: { type: "string", properties: {} },
                                  },
                                  sort_number: { type: "integer", example: 1 },
                                  icon: {
                                    type: "String",
                                    example: "field_name",
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
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
  @ApiOperation({ summary: "لیست دسته بندی" })
  @Get("/categories/list")
  async getCategories(@Request() req: any, @Response() res: Response) {
    console.log("*** getCategories Ad: APP ***");

    const result = await this.realEstateAdsService.getCategories();

    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorException();
    }

    const transformer = this.realEstateAdsTransformer.assortmentCollection(
      result.result
    );
    return this.responseHandler.send(
      res,
      200,
      "لیست دیته بندی ها در دسترس است.",
      transformer
    );
  }

  @ApiOperation({ summary: "لیست دلایل رد آگهی" })
  @Get("/reasons/list")
  async getReasonsList() {
    console.log("*** rejected reason list: App ***");

    return await this.realEstateAdsService.getRejectedReasonList();
  }

  @ApiOperation({ summary: "لیست دلایل حذف آگهی" })
  @Get("/reasons/deleted")
  async getDeletedReasonList() {
    console.log("*** deleted reason list: App ***");
    return await this.realEstateAdsService.getDeletedReasonList();
  }

  @ApiOperation({ summary: "لیست رفتار های مشکوک در آگهی" })
  @Get("/reasons/suspicious-behavior")
  async getSuspiciousBehavior() {
    console.log("*** getSuspiciousBehavior: App ***");
    return await this.realEstateAdsService.getSuspiciousBehavior();
  }

  @ApiOperation({ summary: "ثبت رفتار مشکوک آگهی" })
  @Post("/reasons/suspicious-behavior")
  async saveNewSuspiciousBehavior(
    @Body() body: saveNewSuspiciousBehavior,
    @Request() req: any
  ) {
    console.log("*** save New Suspicious Behavior: App ***");
    body.client_id = req.client.id;

    console.log(body);
    return await this.realEstateAdsService.saveNewSuspiciousBehavior(body);
  }

  @ApiOperation({ summary: "ثبت ارزیابی آگهی" })
  @Post("/reports/estimate-price")
  async storeEstimatePriceForAd(
    @Body() body: EstimatePriceAd,
    @Request() req: any
  ) {
    console.log("*** store Estimate Price For Ad: App ***");
    body.client_id = req.client.id;

    console.log(body);
    return await this.realEstateAdsService.storeEstimatePriceForAd(body);
  }

  @ApiOperation({ summary: "بروزرسانی تاریخ انقضا آگهی" })
  @Post("/update/expired-at")
  async updateExpiredAd(@Body() body: UpdateExpiredAd, @Request() req: any) {
    console.log("*** update Expired Ad: App ***");
    body.client_id = req.client.id;

    console.log(body);
    return await this.realEstateAdsService.updateExpiredAd(body);
  }

  @ApiOperation({
    summary: "ذخیره / ویرایش: تنظیمات نوتیف برای دریافت آگهی ها",
  })
  @ApiConsumes(SwaggerConsumes.Json)
  @Post("/settings/notification")
  async saveAdSettingsForNotification(@Body() body: SaveAdSettingsDto) {
    console.log("*** Save Ad Settings For Notification ***");
    console.log({ body });
    return await this.realEstateAdsService.saveFilteredNotificationForAds(body);
  }

  @ApiOperation({ summary: "دریافت تنظیمات نوتیف برای دریافت آگهی ها" })
  @Get("/settings/notification")
  async getAdSettingsForNotification() {
    console.log("*** Get Ad Settings For Notification ***");
    return await this.realEstateAdsService.getFilteredNotificationForAds();
  }

  @ApiOperation({ summary: "حذف تنظیمات نوتیف برای دریافت آگهی ها" })
  @Delete("/settings/notification/:item_id")
  async deleteAdSettingsForNotification(@Param("item_id") item_id: string) {
    console.log("*** Delete Ad Settings For Notification ***");
    return await this.realEstateAdsService.deleteFilteredNotificationForAds(
      item_id
    );
  }

  // test
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./public/contents/real_estate_ads/",
        filename(req, file, callback) {
          const uniqueCode = randomBytes(3).toString("hex").toUpperCase();
          const extention = parse(join(file.originalname)).ext;
          callback(null, `${Date.now()}-${uniqueCode}${extention}`);
        },
      }),
    })
  )

  // @Get("test")
  testFN() {}
}
