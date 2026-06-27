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
  ParseIntPipe,
} from "@nestjs/common";
import { RealEstateAdsService } from "./real-estate-ads.service";
import {
  ApiConsumes,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import { ForbiddenErrorHandler } from "src/modules/services/httpResponseHandler/forbiddenErrorHandler";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import RealEstateAdsTransformer from "./Transformer";
import { FormDataRequest } from "nestjs-form-data";
import { BadRequestErrorHandler } from "src/modules/services/httpResponseHandler/badRequestErrorHandler";
import { GetRealEstateAdDto } from "./dto/get-real-estate-ads.dto";
import { Admin_ChangeStatusAdDto } from "./dto/change-status-ad.dto";
import AdminTokenAuthGuard from "../../jwt-auth/AdminTokenAuthGuard";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import { UpdateSubCategoryDto } from "./dto/update-sub-category-dto";
import { CreateAdCategoryDto } from "./dto/create-ad-category-dto";
import { saveReasonsForRejectingAdsDto } from "./dto/saveReasonsForRejectingAds-dto";
import { SwaggerConsumes } from "src/commons/enums/swagger.consumes";
import { WarningSignsBeforeTransactionDto } from "./dto/warning-signs-before-transaction-dto";
import { GetReasonsAdDto } from "./dto/get-reasons-ad.dto";

@UseGuards(AdminTokenAuthGuard)
@ApiSecurity("JWT-auth")
@ApiTags("v1/admin/real-estate-ads")
@Controller("v1/admin/real-estate-ads")
export class RealEstateAdsSettingsController {
  constructor(
    private readonly realEstateAdsService: RealEstateAdsService,
    private readonly responseHandler: HttpResponsehandler,
    private readonly realEstateAdsTransformer: RealEstateAdsTransformer
  ) {}

  @ApiOperation({ summary: "دریافت آگهی ها" })
  @Get()
  async findAds(
    @Query() query: GetRealEstateAdDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    query.user_id = req.user.id;
    console.log(query.status);
    console.log("ip_address: ", req.ip_address);

    const result = await this.realEstateAdsService.findAds(query);

    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorException();
    }

    const transformer = this.realEstateAdsTransformer.collectionAdList(
      result.result
    );
    return this.responseHandler.send(res, 200, "لیست آگهی ها در دسترس است.", {
      data: transformer,
      metadata: result.metadata,
    });
  }

  @ApiOperation({ summary: "جزییات آگهی" })
  @Get("/:tracking_code")
  async findDetails(
    @Param("tracking_code") tracking_code: number,
    @Request() req: any,
    @Response() res: Response
  ) {
    console.log("*** findDetails AD ADMIN ***");
    console.log({ tracking_code });

    const result = await this.realEstateAdsService.findDetails(tracking_code);

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. آیتم موردنظر موجود نمیباشد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorException();
    }

    const transformer = this.realEstateAdsTransformer.transformDetails(
      result.result
    );

    return this.responseHandler.send(
      res,
      200,
      "جزییات آگهی درخواستی در دسترس است.",
      transformer
    );
  }

  @ApiOperation({ summary: "تغییر وضعیت آگهی" })
  @Post("change-status")
  async changeStatus(
    @Body() body: Admin_ChangeStatusAdDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.user_id = req.user.id;
    console.log("*** changeStatus Ad: ADMIN ***");
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

  @ApiOperation({ summary: "ایجاد / ویرایش دسته بندی و زیردسته" })
  @Post("/category")
  async saveCategory(
    @Body() body: CreateAdCategoryDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.user_id = req.user.id;
    console.log("*** saveAssortment Ad: ADMIN ***");
    console.log(body);

    const result = await this.realEstateAdsService.saveCategory(body);

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. آیتم موردنظر موجود نمیباشد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorException();
    }

    return this.responseHandler.send(res, 201, "عملیات با موفقیت انجام شد");
  }

  @ApiOperation({ summary: "لیست دسته بندی" })
  @Get("/category/list")
  async getAssortments(
    @Query() body: PaginationDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.user_id = req.user.id;
    console.log("*** getAssortments Ad: ADMIN ***");
    console.log(body);

    const result = await this.realEstateAdsService.getCategorys(body);

    if (result.status === 500) {
      throw new InternalServerErrorException();
    }

    const transformer = this.realEstateAdsTransformer.assortmentCollection(
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

  @ApiOperation({ summary: "حذف دسته بندی" })
  @Delete("/category/:item_id")
  async deleteMainCategory(
    @Param("item_id") item_id: string,
    @Request() req: any,
    @Response() res: Response
  ) {
    console.log("*** deleteAssortments Ad: ADMIN ***");
    console.log(item_id);

    const result = await this.realEstateAdsService.deleteMainCategory(item_id);

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. آیتم موردنظر وجود ندارد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorException();
    }

    return this.responseHandler.send(res, 200, "عملیات با موفقیت انجام شد.");
  }

  @ApiOperation({ summary: "حذف زیر دسته" })
  @Delete("/category/sub/:item_id")
  async deleteSubCategory(
    @Param("item_id") item_id: string,
    @Request() req: any,
    @Response() res: Response
  ) {
    console.log("*** deleteSubAssortment Ad: ADMIN ***");
    console.log(item_id);

    const result = await this.realEstateAdsService.deleteSubCategory(item_id);

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. آیتم موردنظر وجود ندارد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorException();
    }

    return this.responseHandler.send(res, 200, "عملیات با موفقیت انجام شد.");
  }

  @ApiOperation({ summary: "ویرایش زیر دسته" })
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  @Patch("/category/sub")
  async updateSubCategory(
    @Body() body: UpdateSubCategoryDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    console.log("*** updateSubAssortment Ad: ADMIN ***");
    console.log({ body });

    const result = await this.realEstateAdsService.updateSubCategory(body);

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. آیتم موردنظر وجود ندارد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorException();
    }

    return this.responseHandler.send(res, 200, "عملیات با موفقیت انجام شد.");
  }

  @ApiOperation({ summary: " ایجاد / ویرایش دلیل آگهی" })
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  @Post("/reasons")
  async saveReasonsForRejectingAds(
    @Body() body: saveReasonsForRejectingAdsDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.user_id = req.user.id;
    console.log("*** saveReasonsForRejectingAdsDto Ad: ADMIN ***");
    console.log({ body });

    const result = await this.realEstateAdsService.saveReasonsForRejectingAds(
      body
    );

    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorException();
    }
    const transformer = result.result;
    return this.responseHandler.send(
      res,
      201,
      "عملیات با موفقیت انجام شد.",
      transformer
    );
  }

  @ApiOperation({ summary: "خذف دلیل آگهی" })
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  @Delete("/reasons/:item_id")
  async deleteReasonsForRejectingAds(
    @Param("item_id") item_id: string,
    @Request() req: any,
    @Response() res: Response
  ) {
    console.log("*** deleteReasonsForRejectingAds Ad: ADMIN ***");
    console.log({ item_id });

    const result = await this.realEstateAdsService.deleteReasonsForRejectingAds(
      item_id
    );

    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorException();
    }
    return this.responseHandler.send(res, 200, "عملیات با موفقیت انجام شد.");
  }

  @ApiOperation({ summary: "لیست دلایل آگهی" })
  @Get("/reasons/list")
  async getReasonsList(
    @Query() query: GetReasonsAdDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    console.log("*** get Reasons List Ad: ADMIN ***");
    console.log({ query });

    const result = await this.realEstateAdsService.getReasonsList(query);

    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorException();
    }
    return this.responseHandler.send(res, 200, "عملیات با موفقیت انجام شد.", {
      data: result.result,
      metadata: result.metadata,
    });
  }

  @ApiOperation({ summary: "ذخیره زنگ خطرهای قبل از معامله" })
  @ApiConsumes(SwaggerConsumes.Json)
  @Post("/warning-sing-before-transaction")
  async SaveWarningSingBeforeTransaction(
    @Body() body: WarningSignsBeforeTransactionDto
  ) {
    console.log("*** Save WarningSingBeforeTransaction: ADMIN ***");
    console.log({ body });

    return this.realEstateAdsService.SaveWarningSingBeforeTransaction(body);
  }

  @ApiOperation({ summary: "دریافت زنگ خطرهای قبل از معامله" })
  @Post("/get-warning")
  async GetWarningSingBeforeTransaction() {
    console.log("*** Get WarningSingBeforeTransaction: ADMIN ***");

    return this.realEstateAdsService.GetWarningSingBeforeTransaction();
  }

  @ApiOperation({ summary: "حذف آگهی" })
  @ApiConsumes(SwaggerConsumes.Json)
  @Delete(":id")
  async deleteAd(@Param("id", ParseIntPipe) id: number) {
    console.log("*** Delete Ad: ADMIN ***");

    return this.realEstateAdsService.deleteAd(+id);
  }
}
