import {
  Controller,
  Get,
  Post,
  Body,
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
import { MarketplaceBrandsService } from "./marketplace-brands.service";
import { CreateMarketplaceBrandsDto } from "./dto/create-marketplace-brands.dto";
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
import { BadRequestErrorHandler } from "src/modules/services/httpResponseHandler/badRequestErrorHandler";
import { ForbiddenErrorHandler } from "src/modules/services/httpResponseHandler/forbiddenErrorHandler";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { join, parse } from "path";
import AdminTokenAuthGuard from "../jwt-auth/AdminTokenAuthGuard";
import MarketplaceBrandsTransformer from "./Transformer";

@UseGuards(AdminTokenAuthGuard)
@ApiSecurity("JWT-auth")
@ApiTags("v2/admin-marketplace-brands")
@Controller("v2/admin/marketplace/brands")
export class MarketplaceBrandsController {
  constructor(
    private readonly marketplaceBrandsService: MarketplaceBrandsService,
    private readonly responseHandler: HttpResponsehandler,
    private readonly marketplaceBrandsTransformer: MarketplaceBrandsTransformer
  ) {}

  // ایجاد برند
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
        destination: "./public/contents/marketplace/brands/",
        filename(req, file, callback) {
          const filename = parse(join(file.originalname)).name;
          const extention = parse(join(file.originalname)).ext;

          callback(null, `${filename}-${Date.now()}${extention}`);
        },
      }),
    })
  )
  @ApiOperation({ summary: "ایجاد / ویرایش برند" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: CreateMarketplaceBrandsDto })
  @Post("")
  async saveBrands(
    @Body() body: CreateMarketplaceBrandsDto,
    @Request() req: any,
    @Response() res: Response,
    @UploadedFile() thumbnail: Express.Multer.File
  ) {
    body.thumbnail = thumbnail ? thumbnail.filename : null;
    body.user_id = req.user.id;

    console.log("*** save Brands marketplace: ADMIN ***");
    console.log(body);

    const result = await this.marketplaceBrandsService.saveBrand(body);

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. آیتم موردنظر موجود نمیباشد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorException();
    }

    return this.responseHandler.send(res, 201, "عملیات با موفقیت انجام شد");
  }

  // لیست برند
  @ApiOkResponse({
    description: "لیست برندها در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "لیست برندها در دسترس است.",
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
                  second_title: { type: "String" },
                  description: { type: "String" },
                  status: { type: "String" },
                  thumbnail: { type: "String" },
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
  @ApiOperation({ summary: "لیست برندها" })
  @Get("/list")
  async getAssortments(
    @Query() body: PaginationDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.user_id = req.user.id;
    console.log("*** get Brands in Marketplace: ADMIN ***");
    console.log(body);

    const result = await this.marketplaceBrandsService.getBrands(body);

    if (result.status === 500) {
      throw new InternalServerErrorException();
    }

    const transformer = this.marketplaceBrandsTransformer.collection(
      result.result
    );
    return this.responseHandler.send(res, 200, "لیست برندها در دسترس است.", {
      data: transformer,
      metadata: result.metadata,
    });
  }

  // حذف برند
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
  @ApiOperation({ summary: "حذف برند" })
  @Delete("/:item_id")
  async deleteMainBrands(
    @Param("item_id") item_id: string,
    @Request() req: any,
    @Response() res: Response
  ) {
    console.log("*** delete Brands in Marketplace: ADMIN ***");
    console.log(item_id);

    const result = await this.marketplaceBrandsService.deleteBrand(item_id);

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
