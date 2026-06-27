import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Response,
  Query,
  InternalServerErrorException,
} from "@nestjs/common";
import { RealEstateAdsService } from "./real-estate-ads.service";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ForbiddenErrorHandler } from "src/modules/services/httpResponseHandler/forbiddenErrorHandler";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { GetDetailsRealEstateAdItemsDto } from "./dto/get-details-real-estate-ads.dto";
import RealEstateAdsTransformer from "./Transformer";
import { BadRequestErrorHandler } from "src/modules/services/httpResponseHandler/badRequestErrorHandler";
import { GetRealEstateAdDto } from "./dto/get-real-estate-ads.dto";
import { FilteredDto } from "./dto/filtered.dto";

@ApiTags("v1/site-real-estate-ads")
@Controller("v1/site/real-estate-ads")
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

  @ApiOperation({ summary: "فیلتر آگهی ها" })
  @Post("filter")
  async filteredAds(
    @Body() body: FilteredDto,
    @Request() req: any,
    @Response() res: Response
  ) {
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

  @ApiOperation({ summary: "جزییات آگهی" })
  @Get("details")
  async findDetails(@Query() query: GetDetailsRealEstateAdItemsDto) {
    return await this.realEstateAdsService.findDetails(query);
  }

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
      "لیست دسته بندی ها در دسترس است.",
      transformer
    );
  }
}
