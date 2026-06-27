import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Response,
  InternalServerErrorException,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { RealEstateAdsService_robotScraper } from "./real-estate-ads.service";
import {
  CreateRealEstateAdRobotScraperDto,
  DownloadFileUrl,
} from "./dto/create-real-estate-roborScraper-ads.dto";
import {
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { ForbiddenErrorHandler } from "src/modules/services/httpResponseHandler/forbiddenErrorHandler";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import RealEstateAdsTransformer from "./Transformer";
import { SwaggerConsumes } from "src/commons/enums/swagger.consumes";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { randomBytes } from "crypto";
import { join, parse } from "path";

@ApiTags("v2/app-real-estate-ads-scraper")
@Controller("v2/app/real-estate-ads/scraper")
export class RealEstateAdsRobotScraperController {
  constructor(
    private readonly realEstateAdsService: RealEstateAdsService_robotScraper,
    private readonly responseHandler: HttpResponsehandler,
    private readonly realEstateAdsTransformer: RealEstateAdsTransformer
  ) {}

  // ایجاد آگهی
  @Post()
  @ApiOperation({ summary: "ذخیره آگهی - اسکرپر" })
  async create(
    @Body() body: CreateRealEstateAdRobotScraperDto,
    @Response() res: Response
  ) {
    console.log("*** Save Ad: RobotScraper ***");
    // console.log({ body });

    const result = await this.realEstateAdsService.storeAd(body);
    if (result.status === 500) {
      throw new InternalServerErrorException();
    }

    return this.responseHandler.send(res, 201, "آگهی جدید ثبت شد.");
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

  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./public/contents/real_estate_ads/scraper/",
        filename(req, file, callback) {
          const uniqueCode = randomBytes(3).toString("hex").toUpperCase();
          const extention = parse(join(file.originalname)).ext;
          callback(null, `${Date.now()}-${uniqueCode}${extention}`);
        },
      }),
    })
  )
  @Post("test/download")
  @ApiConsumes(SwaggerConsumes.Json)
  @ApiOperation({ summary: "تست - دانلود فایل از URL" })
  async testDownloadFile(@Body() body: DownloadFileUrl) {
    console.log(" test Download File");
    console.log(body);

    return await this.realEstateAdsService.downloadFile(body);
  }
}
