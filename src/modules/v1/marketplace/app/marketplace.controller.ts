import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { MarketplaceService } from "./marketplace.service";
import TokenAuthGuardClient from "../../jwt-auth/TokenAuthGuardClient";
import {
  ApiConsumes,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import { Pagination } from "src/commons/decorators/pagination.decorator";
import { PaginationDto } from "src/commons/dto/pagination.dto";
import { GetProductsInMarketplaceDto } from "./dto/get-products.dto";
import { GetBrands } from "./dto/brands.dto";
import { FilterProductsDto } from "./dto/filter-products.dto";
import { SwaggerConsumes } from "src/commons/enums/swagger.consumes";
import { MarketplaceHomePageDto } from "./dto/marketplace-home-page.dto";

@UseGuards(TokenAuthGuardClient)
@ApiSecurity("JWT-auth")
@ApiTags("v1/app/marketplace")
@Controller("v1/app/marketplace")
export class MarketplaceAppController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @ApiOperation({ summary: "اطلاعات صفحه اصلی نمایشگاه" })
  @Get("home-page")
  getHomePage(@Query() query: MarketplaceHomePageDto) {
    return this.marketplaceService.getHomePage(query);
  }

  @ApiOperation({ summary: "لیست برندها" })
  @Get("brands")
  @Pagination()
  getBrands(@Query() query: GetBrands) {
    return this.marketplaceService.getBrands(query);
  }

  @ApiOperation({ summary: "جزییات برند" })
  @Get("brands/:brandId")
  getBrandDetails(@Param("brandId") brandId: string) {
    return this.marketplaceService.getBrandDetails(brandId);
  }

  @ApiOperation({ summary: "لیست دسته بندی ها" })
  @Get("categories")
  @Pagination()
  getCategories(@Query() pagination: PaginationDto) {
    return this.marketplaceService.getCategories(pagination);
  }

  @ApiOperation({ summary: "لیست محصولات" })
  @Get("products")
  @Pagination()
  getProducts(@Query() query: GetProductsInMarketplaceDto) {
    console.log("GetProductsInMarketplaceDto");
    console.log(query);
    return this.marketplaceService.getProducts(query);
  }

  @ApiOperation({ summary: "فیلتر محصولات" })
  @Post("filter/products")
  @ApiConsumes(SwaggerConsumes.Json)
  filteredProducts(@Body() body: FilterProductsDto) {
    console.log("filteredProducts");
    console.log(body);
    return this.marketplaceService.filteredProducts(body);
  }

  @ApiOperation({ summary: "دریافت جزییات یک محصول" })
  @Get("products/:product_id")
  getProductInfo(@Param("product_id") product_id: string) {
    console.log("getProductInfo");
    console.log({ product_id });
    return this.marketplaceService.getProductDetails(product_id);
  }
}
