import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Get,
  Query,
  Param,
  Delete,
  Patch,
} from "@nestjs/common";
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { join, parse } from "path";
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
import { StorefrontService } from "./storefront.service";
import { CreateStorefrontDto } from "./dto/create-storefront.dto";
import { ListStorefrontDto } from "./dto/list-storefront.dto";
import { CheckAvatarMiddleware } from "./dto/check-avatar.middleware";
import { CheckLicenseMiddleware } from "./dto/check-lisence.middleware";
import { randomBytes } from "crypto";
import BadRequestSchema from "src/commons/contracts/swaggerDefinations/BadRequestSchema";
import { FormDataRequest } from "nestjs-form-data";
import { DeleteMediaProductsDto } from "./dto/delete-media-item-products.dto";
import { UploadFileProductsDto } from "./dto/upload-file-products.dto";
import { ChangeCoverMediaProductDto } from "./dto/change-cover-media-item.dto";
import { SaveProductDto } from "./dto/save-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { GetProductDto } from "./dto/get-product.dto";
import { ChangeStatusProductDto } from "./dto/change-status-product.dto";
import TokenAuthGuardClient from "../../jwt-auth/TokenAuthGuardClient";

@UseGuards(TokenAuthGuardClient)
@ApiSecurity("JWT-auth")
@ApiTags("v1/app-marketplace-storefront")
@Controller("v1/app/marketplace/storefront")
export class StorefrontController {
  constructor(private readonly storefrontService: StorefrontService) {}

  @ApiOperation({ summary: "ثبت / ویرایش درخواست فروشگاه" })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: "avatar", maxCount: 1 },
        { name: "license", maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: "./public/contents/temp/storefronts",
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
  @ApiBody({ type: CreateStorefrontDto })
  @ApiConsumes("multipart/form-data")
  async create(
    @Body() body: CreateStorefrontDto,
    @UploadedFiles()
    files: { avatar?: Express.Multer.File; license?: Express.Multer.File }
  ) {
    const { avatar, license } = files;
    const avatarName = avatar ? avatar[0].filename : null;
    const licenseName = license ? license[0].filename : null;

    body.avatar = null;
    if (files.avatar) {
      body.avatar = avatarName;
    }

    body.license = null;
    if (files.license) {
      body.license = licenseName;
    }

    console.log("*** Store Request: APP ***");
    console.log(body);

    return await this.storefrontService.storeRequest(body);
  }

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
  @ApiOperation({ summary: "لیست/سرچ فروشگاه" })
  @Get()
  async listOfStorefronts(@Query() query: ListStorefrontDto) {
    console.log("listOfStorefronts: APP");
    console.log({ query });

    return await this.storefrontService.listOfStorefronts(query);
  }

  @ApiOkResponse({
    description: "جزییات فروشگاه در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "جزییات فروشگاه در دسترس است.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            client_id: { type: "integer", example: 1 },
            tracking_code: { type: "string" },
            phone: { type: "string" },
            avatar: { type: "string" },
            license: { type: "string" },
            license_status: {
              type: "string",
              example: "pending || approved || rejected",
            },
            status: { type: "string", example: "active, inactive" },
            score: { type: "number", example: 0 },
            number_of_products: { type: "number", example: 0 },
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
    },
  })
  @ApiOperation({ summary: "جزییات فروشگاه" })
  @Get("info/:store_id")
  async GetStorefrontInfo(@Param("store_id") store_id: string) {
    return await this.storefrontService.storefrontDetails(store_id);
  }

  @ApiOkResponse({
    description: "نیازمندی ها در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "نیازمندی ها در دسترس است.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            categories: {
              type: "array",
              items: {
                properties: {
                  id: { type: "number" },
                  title: { type: "string" },
                  form_items: {
                    type: "array",
                    items: {
                      properties: {
                        id: { type: "number", example: 1 },
                        field_name: { type: "string" },
                        is_active: { type: "boolean" },
                        required: { type: "boolean" },
                        field_type: { type: "string" },
                        values: { type: "array" },
                        sort_number: { type: "number", example: 1 },
                        status: { type: "string" },
                        key: { type: "string" },
                        formId: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
            brands: {
              type: "array",
              items: {
                properties: {
                  id: { type: "integer", example: 1 },
                  title: { type: "string" },
                  thumbnail: { type: "string" },
                },
              },
            },
            units: {
              type: "array",
              items: {},
            },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: "لیست نیازمندی های ثبت محصول" })
  @Get("requirements")
  async getProperties() {
    console.log("getProperties for storefront");

    return await this.storefrontService.getCategories();
  }

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
        destination: "./public/contents/temp/products/files/",
        filename(req, file, callback) {
          const uniqueCode = randomBytes(3).toString("hex").toUpperCase();
          const extention = parse(join(file.originalname)).ext;
          callback(null, `${Date.now()}-${uniqueCode}${extention}`);
        },
      }),
    })
  )
  @ApiOperation({ summary: "آپلود فایل" })
  @Post("file")
  @ApiBody({ type: UploadFileProductsDto })
  @ApiConsumes("multipart/form-data")
  async UploadTempFile(@Body() body: UploadFileProductsDto) {
    return await this.storefrontService.UploadFile(body);
  }

  @ApiBadRequestResponse({
    description: "خطا. آیتم موردنظر موجود نمیباشد.",
    type: BadRequestSchema,
    schema: {
      $ref: getSchemaPath(BadRequestSchema),
    },
  })
  @ApiOperation({ summary: "حذف فایل " })
  @Delete("file")
  async removeAdFile(@Query() query: DeleteMediaProductsDto) {
    console.log("*** removeProductFile ***");
    console.log(query);

    return await this.storefrontService.removeFile(query);
  }

  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  @ApiOperation({ summary: "تغییر کاور " })
  @Post("/change_cover")
  async changeCover(@Body() body: ChangeCoverMediaProductDto) {
    return await this.storefrontService.changeCover(body);
  }

  @ApiOperation({ summary: "ذخیره محصول" })
  @Post("/product")
  async SaveNewProduct(@Body() body: SaveProductDto) {
    return await this.storefrontService.SaveNewProduct(body);
  }

  @ApiOperation({ summary: "ویرایش محصول" })
  @Patch("/product")
  async updateProduct(@Body() body: UpdateProductDto) {
    return await this.storefrontService.updateProduct(body);
  }

  @ApiOperation({ summary: "دریافت محصولات یک فروشگاه" })
  @Get("/product")
  async findStorefrontProducts(@Query() body: GetProductDto) {
    console.log("findStorefrontProducts");
    console.log(body);

    return await this.storefrontService.findStorefrontProducts(body);
  }

  @ApiOperation({ summary: "تغییر وضعیت یک محصول" })
  @Patch("/product/change_status")
  async changeStatusProduct(@Body() body: ChangeStatusProductDto) {
    console.log("ChangeStatusProduct ");
    console.log(body);

    return await this.storefrontService.changeStatusProduct(body);
  }

  @ApiOperation({ summary: "حذف محصول" })
  @Delete("/product/:product_id")
  async deleteProduct(@Param("product_id") product_id: string) {
    console.log("deleteProduct ");
    console.log({ product_id });

    return await this.storefrontService.deleteProduct(product_id);
  }

  @ApiOperation({ summary: "بوکمارک / حذف فروشگاه" })
  @Post("/bookmark/:storefront_id")
  async addStorefrontIntoBookmark(
    @Param("storefront_id") storefront_id: string
  ) {
    console.log("addStorefrontIntoBookmark ");
    console.log({ storefront_id });

    return await this.storefrontService.addStorefrontIntoBookmark(
      storefront_id
    );
  }
  @ApiOperation({ summary: "لیست بوکمارک شده ها" })
  @Get("/bookmark")
  async getBookmarkedList() {
    console.log("getBookmarkedList ");

    return await this.storefrontService.getBookmarkedList();
  }
}
