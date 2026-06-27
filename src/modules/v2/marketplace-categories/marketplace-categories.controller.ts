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
  Query,
  InternalServerErrorException,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { MarketplaceCategoriesService } from "./marketplace-categories.service";
import { CreateMarketplaceCategoryDto } from "./dto/create-marketplace-category.dto";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import { FormDataRequest } from "nestjs-form-data";
import { UpdateMarketplaceSubCategoryDto } from "./dto/update-sub-category-dto";
import { BadRequestErrorHandler } from "src/modules/services/httpResponseHandler/badRequestErrorHandler";
import { ForbiddenErrorHandler } from "src/modules/services/httpResponseHandler/forbiddenErrorHandler";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { join, parse } from "path";
import AdminTokenAuthGuard from "../jwt-auth/AdminTokenAuthGuard";
import MarketplaceCategoriesTransformer from "./Transformer";
import { CheckFileMiddleware } from "src/middlewares/check-file.middleware";

@UseGuards(AdminTokenAuthGuard)
@ApiSecurity("JWT-auth")
@ApiTags("v2/admin-marketplace-categories")
@Controller("v2/admin/marketplace/categories")
@Controller("marketplace-categories")
export class MarketplaceCategoriesController {
  constructor(
    private readonly marketplaceCategoriesService: MarketplaceCategoriesService,
    private readonly responseHandler: HttpResponsehandler,
    private readonly marketplaceCategoriesTransformer: MarketplaceCategoriesTransformer
  ) {}

  // ایجاد دسته بندی
  @ApiCreatedResponse({
    description: "عملیات با موفقیت انجام شد",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 201 },
        message: {
          type: "string",
          example: "عملیات با موفقیت انجام شد",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {},
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor("thumbnail", {
      storage: diskStorage({
        destination: "./public/contents/marketplace/categories/",
        filename(req, file, callback) {
          const filename = parse(join(file.originalname)).name;
          const extention = parse(join(file.originalname)).ext;

          callback(null, `${filename}-${Date.now()}${extention}`);
        },
      }),
    }),
    CheckFileMiddleware
  )
  @ApiOperation({ summary: "ایجاد / ویرایش دسته بندی و زیردسته" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: CreateMarketplaceCategoryDto })
  @Post("")
  async saveCategory(
    @Body() body: CreateMarketplaceCategoryDto,
    @Request() req: any,
    @Response() res: Response,
    @UploadedFile() thumbnail: Express.Multer.File
  ) {
    body.thumbnail = thumbnail ? thumbnail.filename : null;
    body.user_id = req.user.id;

    console.log("*** save category marketplace: ADMIN ***");
    console.log(body);

    const result = await this.marketplaceCategoriesService.saveCategory(body);

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. آیتم موردنظر موجود نمیباشد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorException();
    }

    return this.responseHandler.send(res, 201, "عملیات با موفقیت انجام شد");
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
                  status: { type: "String" },
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "integer", example: 1 },
                        title: { type: "String" },
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
  @Get("/list")
  async getAssortments(
    @Query() body: PaginationDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.user_id = req.user.id;
    console.log("*** get Categories in Marketplace: ADMIN ***");
    console.log(body);

    const result = await this.marketplaceCategoriesService.getCategories(body);

    if (result.status === 500) {
      throw new InternalServerErrorException();
    }

    const transformer = this.marketplaceCategoriesTransformer.collection(
      result.result
    );
    return this.responseHandler.send(
      res,
      200,
      "لیست دیته بندی ها در دسترس است.",
      {
        data: transformer,
        metadata: result.metadata,
      }
    );
  }

  // حذف دسته بندی
  @ApiOkResponse({
    description: "عملیات با موفقیت انجام شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "عملیات با موفقیت انجام شد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {},
        },
      },
    },
  })
  @ApiOperation({ summary: "حذف دسته بندی" })
  @Delete("/:item_id")
  async deleteMainCategory(
    @Param("item_id") item_id: string,
    @Request() req: any,
    @Response() res: Response
  ) {
    console.log("*** delete Category in Marketplace: ADMIN ***");
    console.log(item_id);

    const result = await this.marketplaceCategoriesService.deleteMainCategory(
      item_id
    );

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. آیتم موردنظر وجود ندارد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorException();
    }

    return this.responseHandler.send(res, 200, "عملیات با موفقیت انجام شد.");
  }

  // حذف زیر دسته
  @ApiOkResponse({
    description: "عملیات با موفقیت انجام شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "عملیات با موفقیت انجام شد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {},
        },
      },
    },
  })
  @ApiOperation({ summary: "حذف زیر دسته" })
  @Delete("/sub/:item_id")
  async deleteSubCategory(
    @Param("item_id") item_id: string,
    @Request() req: any,
    @Response() res: Response
  ) {
    console.log("*** delete SubCategory in Marketplace: ADMIN ***");
    console.log(item_id);

    const result = await this.marketplaceCategoriesService.deleteSubCategory(
      item_id
    );

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. آیتم موردنظر وجود ندارد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorException();
    }

    return this.responseHandler.send(res, 200, "عملیات با موفقیت انجام شد.");
  }

  // ویرایش زیر دسته
  @ApiOkResponse({
    description: "عملیات با موفقیت انجام شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "عملیات با موفقیت انجام شد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {},
        },
      },
    },
  })
  @ApiOperation({ summary: "ویرایش زیر دسته" })
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  @Patch("/sub")
  async updateSubCategory(
    @Body() body: UpdateMarketplaceSubCategoryDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    console.log("*** update SubCategory in Marketplace: ADMIN ***");
    console.log({ body });

    const result = await this.marketplaceCategoriesService.updateSubCategory(
      body
    );

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. آیتم موردنظر وجود ندارد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorException();
    }

    return this.responseHandler.send(res, 200, "عملیات با موفقیت انجام شد.");
  }
}
