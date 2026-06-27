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
} from "@nestjs/common";
import { ProductFeatureFormsService } from "./product-feature-forms.service";
import { CreateProductFeatureDto } from "./dto/create-productfeature-form-item.dto";
import { UpdateProductFeatureFormDto } from "./dto/update-product-feature-form.dto";
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
import { GetProductFeaturesDto } from "./dto/get-product-feature-forms.dto";
import ProductFeatureFormsTransformer from "./Transformer";
import { BadRequestErrorHandler } from "src/modules/services/httpResponseHandler/badRequestErrorHandler";
import { FormDataRequest } from "nestjs-form-data";
import { UpdateSortProductFeatureFormsDto } from "./dto/update-sort-product-feature-forms.dto";
import AdminTokenAuthGuard from "../../jwt-auth/AdminTokenAuthGuard";
import { createProductFeatureFormsDto } from "./dto/create-product-feature-form.dto";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import { UpdateProductFeatureDto } from "./dto/update-product-feature.dto";

@UseGuards(AdminTokenAuthGuard)
@ApiSecurity("JWT-auth")
@ApiTags("v2/admin-marketplace-product-features-forms")
@Controller("v2/admin/marketplace/product/features/forms")
export class ProductFeatureFormsController {
  constructor(
    private readonly realEstateAdsFormsService: ProductFeatureFormsService,
    private readonly realEstateAdFormsTransformer: ProductFeatureFormsTransformer,
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
    @Body() body: createProductFeatureFormsDto,
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

    console.log("find Product Feature Forms: ADMIN");
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
    @Body() body: UpdateProductFeatureFormDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.user_id = req.user.id;

    console.log("Update Product Feature Forms: ADMIN");
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
  @Post("/items")
  @ApiBody({ type: CreateProductFeatureDto })
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "ذخیره آیتم جدید" })
  @FormDataRequest()
  async saveItem(
    @Body() body: CreateProductFeatureDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.user_id = req.user.id;

    console.log("Save Feature for product form: ADMIN");
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
    @Query() query: GetProductFeaturesDto,
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
  @ApiBody({ type: UpdateProductFeatureDto })
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  @ApiOperation({ summary: "بروزرسانی آیتم" })
  async updateItem(
    @Body() body: UpdateProductFeatureDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.user_id = req.user.id;

    console.log("Update Feature Product Form: ADMIN");
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
    @Body() body: UpdateSortProductFeatureFormsDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.user_id = req.user.id;

    console.log("Update Draggable Feature Product");
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
