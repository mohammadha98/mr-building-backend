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
  Patch,
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
import { StorefrontService } from "./storefront.service";
import { renameSync } from "fs";
import { InternalServerErrorHandler } from "src/modules/services/httpResponseHandler/internalServerErrorHandler";
import { ForbiddenErrorHandler } from "src/modules/services/httpResponseHandler/forbiddenErrorHandler";
import { JwtAuthGuard } from "src/modules/v1/jwt-auth/jwt-auth.guard";
import { ListStorefrontsDto } from "./dto/list-storefronts.dto";
import StorefrontAdminTransformer from "./Transformer";
import { RealEstateAgentChangeStatusDto } from "./dto/storefront-change-status.dtop";
import AdminTokenAuthGuard from "../../jwt-auth/AdminTokenAuthGuard";
import { GetProductDto } from "../app/dto/get-product.dto";
import { BadRequestErrorHandler } from "src/modules/services/httpResponseHandler/badRequestErrorHandler";

@UseGuards(AdminTokenAuthGuard)
@ApiSecurity("JWT-auth")
@ApiTags("v1/admin-marketplace-storefronts")
@Controller("v1/admin/marketplace-storefronts")
export class StorefrontController {
  constructor(
    private readonly storefrontService: StorefrontService,
    private readonly storefrontTransFormer: StorefrontAdminTransformer,
    private readonly responseHandler: HttpResponsehandler
  ) {}

  // دریافت لیست فروشگاه ها
  @ApiOkResponse({
    description: "لیست فروشگاه ها در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "لیست فروشگاه  ها در دسترس است.",
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
                  tracking_code: { type: "string" },
                  client_id: { type: "integer", example: 1 },
                  name: { type: "string" },
                  description: { type: "string" },
                  color: { type: "string" },
                  avatar: { type: "string" },
                  score: { type: "number", example: 0 },
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
  @ApiOperation({ summary: "لیست فروشگاه ها   " })
  @Get()
  async listOfStorefronts(
    @Query() query: ListStorefrontsDto,
    @Response() res: Response
  ) {
    console.log("listOfStorefronts: APP");
    console.log({ query });

    const result = await this.storefrontService.listOfStorefronts(query);

    if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    const transformer = this.storefrontTransFormer.collection(result.list);

    return this.responseHandler.send(
      res,
      200,
      "لیست فروشگاه ها در دسترس است.",
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
    const result = await this.storefrontService.changeStatus(query);
    if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    return this.responseHandler.send(res, 200, "وضعیت با موفقیت تغییر کرد.", {
      status: result.client_status,
      license_status: result.license_status,
    });
  }

  @ApiOkResponse({
    description: "محصولات فروشگاه در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "محصولات فروشگاه در دسترس است.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                properties: {
                  id: { type: "string" },
                  category: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      title: { type: "string" },
                    },
                  },
                  sub_category: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      title: { type: "string" },
                    },
                  },
                  brand: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      title: { type: "string" },
                    },
                  },
                  tracking_code: { type: "string" },
                  title: { type: "string" },
                  description: { type: "string" },
                  status: { type: "string", example: "active, inactive" },
                  price: { type: "string" },
                  unit_of_sales: { type: "string" },
                  has_discount: { type: "boolean", default: false },
                  discounted_price: { type: "string" },
                  colors: {
                    type: "array",
                    items: {
                      type: "string",
                      properties: {},
                    },
                  },

                  files: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "integer", default: 1 },
                        file_name: { type: "string" },
                        file_type: { type: "string" },
                        file_url: { type: "string" },
                        sort_number: { type: "integer", default: 1 },
                        priority: {
                          type: "string",
                          example: "normal, primary",
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
  @ApiOperation({ summary: "دریافت محصولات یک فروشگاه" })
  @Get("/product")
  async findStorefrontProducts(
    @Query() body: GetProductDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.client_id = req.user.id;
    console.log("findStorefrontProducts");
    console.log(body);

    const result = await this.storefrontService.findStorefrontProducts(body);

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. فروشگاه مورنظر یافت نشد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorException();
    }

    const transform = this.storefrontTransFormer.collectionProduct(result.list);

    return this.responseHandler.send(
      res,
      200,
      "محصولات فروشگاه در دسترس است.",
      {
        data: transform,
        metadata: result.metadata,
      }
    );
  }
}
