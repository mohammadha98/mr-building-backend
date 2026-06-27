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
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
} from "@nestjs/common";
import { RealEstateAdsFormsService } from "./real-estate-ads-forms.service";
import { CreateRealEstateAdFormsItemsDto } from "./dto/create-real-estate-ads-form-item.dto";
import { UpdateRealEstateAdsFormsDto } from "./dto/update-real-estate-ads-forms.dto";
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import { ForbiddenErrorHandler } from "src/modules/services/httpResponseHandler/forbiddenErrorHandler";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { GetRealEstateAdFormsItemsDto } from "./dto/get-real-estate-ads-forms.dto";
import RealEstateAdFormsTransformer from "./Transformer";
import { join, parse } from "path";
import { randomBytes } from "crypto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { BadRequestErrorHandler } from "src/modules/services/httpResponseHandler/badRequestErrorHandler";
import { FormDataRequest } from "nestjs-form-data";
import { UpdateSortItemsRealEstateAdsFormsDto } from "./dto/update-sort-items-real-estate-ads-forms.dto";
import { CheckIconMiddleware } from "./dto/CheckIconMiddleware ";
import AdminTokenAuthGuard from "../../jwt-auth/AdminTokenAuthGuard";
import { CreateRealEstateAdFormsDto } from "./dto/create-real-estate-ads-form.dto";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import { UpdateRealEstateAdFormsItemsDto } from "./dto/update-real-estate-ads-form-item.dto";

@UseGuards(AdminTokenAuthGuard)
@ApiSecurity("JWT-auth")
@ApiTags("v2/admin-real-estate-ads-forms")
@Controller("v2/admin/real-estate-ads-forms")
export class RealEstateAdsFormsController {
  constructor(
    private readonly realEstateAdsFormsService: RealEstateAdsFormsService,
    private readonly realEstateAdFormsTransformer: RealEstateAdFormsTransformer,
    private readonly responseHandler: HttpResponsehandler
  ) {}

  // ایجاد فرم
  @ApiCreatedResponse({
    description: "فرم جدید با موفقیت ایجاد شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 201 },
        message: {
          type: "string",
          example: "فرم جدید با موفقیت ایجاد شد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
          },
        },
      },
    },
  })
  @Post()
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  @ApiOperation({ summary: "ایجاد فرم" })
  async createForm(
    @Body() body: CreateRealEstateAdFormsDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.user_id = req.user.id;

    const result = await this.realEstateAdsFormsService.createNewForm(body);

    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorException();
    }

    return this.responseHandler.send(
      res,
      201,
      "فرم جدید با موفقیت ایجاد شد.",
      result.result
    );
  }

  // دریافت فرم ها
  @ApiOkResponse({
    description: "لیست فرم ها در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "لیست فرم ها در دسترس است.",
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
                  title: { type: "string" },
                  description: { type: "string" },
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
  @ApiOperation({ summary: "دریافت فرم ها" })
  @Get()
  async findForms(
    @Query() query: PaginationDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    query.user_id = req.user.id;

    console.log("findForms: ADMIN");
    console.log({ query });

    const result = await this.realEstateAdsFormsService.findForms(query);
    const transformer = this.realEstateAdFormsTransformer.collection(
      result.result
    );

    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorException();
    }

    return this.responseHandler.send(
      res,
      200,
      "آیتم های فرم آگهی املاک در دسترس است.",
      {
        data: transformer,
        metadata: result.metadata,
      }
    );
  }

  // بروزرسانی آیتم
  @Patch()
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  @ApiOperation({ summary: "بروزرسانی فرم" })
  async updateForm(
    @Body() body: UpdateRealEstateAdsFormsDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.user_id = req.user.id;

    console.log("updateForm");
    console.log(body);

    const result = await this.realEstateAdsFormsService.updateForm(body);

    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorException();
    }

    return this.responseHandler.send(res, 200, "ویرایش با موفقیت انجام شد");
  }

  // حذف فرم
  @ApiOperation({ summary: "حذف فرم" })
  @Delete(":form_id")
  async removeForm(
    @Param("form_id") form_id: string,
    @Request() req: any,
    @Response() res: Response
  ) {
    const result = await this.realEstateAdsFormsService.removeForm(form_id);

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. آیتم موردنظر موجود نمیباشد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorException();
    }

    return this.responseHandler.send(res, 200, "فرم موردنظر با موفقیت حذف شد.");
  }

  // ذخیره آیتم جدید
  @UseInterceptors(
    FileInterceptor("icon", {
      storage: diskStorage({
        destination: "./public/contents/real_estate_ad_forms/icons",
        filename(req, file, callback) {
          const uniqueCode = randomBytes(3).toString("hex").toUpperCase();

          const extention = parse(join(file.originalname)).ext;

          callback(null, `${Date.now()}-${uniqueCode}${extention}`);
        },
      }),
    })
  )
  @Post("/items")
  @ApiBody({ type: CreateRealEstateAdFormsItemsDto })
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "ذخیره آیتم جدید" })
  async saveItem(
    @Body() body: CreateRealEstateAdFormsItemsDto,
    @UploadedFile() icon: Express.Multer.File,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.user_id = req.user.id;
    body.icon = icon.filename;

    console.log("saveItemForm: ADMIN");
    console.log({ body });

    const result = await this.realEstateAdsFormsService.saveItem(body);
    const transform = this.realEstateAdFormsTransformer.transformItem(
      result.result
    );

    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorException();
    }

    return this.responseHandler.send(
      res,
      201,
      "آیتم جدید با موفقیت ذخیره شد.",
      transform
    );
  }

  // دریافت آیتم های فرم
  @ApiOperation({ summary: "دریافت آیتم های فرم" })
  @Get("items")
  async findItems(
    @Query() query: GetRealEstateAdFormsItemsDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    query.client_id = req.user.id;

    console.log("findItemsForm: ADMIN");
    console.log({ query });

    const result = await this.realEstateAdsFormsService.findItems(query);
    const transformer = this.realEstateAdFormsTransformer.collectionItem(
      result.result
    );

    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorException();
    }

    return this.responseHandler.send(
      res,
      200,
      "آیتم های فرم آگهی املاک در دسترس است.",
      transformer
    );
  }

  // حذف آیتم
  @ApiOperation({ summary: "حذف آیتم" })
  @Delete("/items/:item_id")
  async removeItem(
    @Param("item_id") item_id: string,
    @Request() req: any,
    @Response() res: Response
  ) {
    console.log("removeItemForm: ADMIN");
    console.log(item_id);

    const result = await this.realEstateAdsFormsService.removeItem(item_id);

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. آیتم موردنظر موجود نمیباشد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorException();
    }

    return this.responseHandler.send(
      res,
      200,
      "آیتم موردنظر با موفقیت حذف شد."
    );
  }

  // بروزرسانی آیتم
  @Patch("/items")
  @UseInterceptors(
    FileInterceptor("icon", {
      storage: diskStorage({
        destination: "./public/contents/real_estate_ad_forms/icons",
        filename(req, file, callback) {
          const uniqueCode = randomBytes(3).toString("hex").toUpperCase();
          const extention = parse(join(file.originalname)).ext;
          callback(null, `${Date.now()}-${uniqueCode}${extention}`);
        },
      }),
    }),
    CheckIconMiddleware
  )
  @ApiBody({ type: UpdateRealEstateAdFormsItemsDto })
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "بروزرسانی آیتم" })
  async updateItem(
    @Body() body: UpdateRealEstateAdFormsItemsDto,
    @UploadedFile(new ParseFilePipe({ fileIsRequired: false }))
    icon: Express.Multer.File,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.user_id = req.user.id;
    body.icon = icon ? icon.filename : null;

    console.log("updateItemForm: ADMIN");
    console.log(body);

    const result = await this.realEstateAdsFormsService.updateItem(body);

    const transform = this.realEstateAdFormsTransformer.transformItem(
      result.result
    );

    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorException();
    }

    return this.responseHandler.send(
      res,
      200,
      "ویرایش با موفقیت انجام شد",
      transform
    );
  }

  // ذخیره جابجایی آیتم ها
  @ApiOperation({ summary: "ذخیره جابجایی آیتم ها" })
  @Post("change_priority")
  async updateDraggableItems(
    @Body() body: UpdateSortItemsRealEstateAdsFormsDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.user_id = req.user.id;

    console.log("updateDraggableItems");
    console.log(body);

    const result = await this.realEstateAdsFormsService.updateDraggableItems(
      body
    );

    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorException();
    }

    return this.responseHandler.send(
      res,
      200,
      "آیتم موردنظر با موفقیت حذف شد."
    );
  }
}
