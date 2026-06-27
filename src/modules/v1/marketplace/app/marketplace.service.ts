import { Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { MarketplaceFactory } from "./fartories/marketplace-factory";
import { HttpStatusCode } from "axios";
import { PublicMessage } from "src/commons/enums/messages";
import { PaginationDto } from "src/commons/dto/pagination.dto";
import { GetProductsInMarketplaceDto } from "./dto/get-products.dto";
import { GetBrands } from "./dto/brands.dto";
import { MarketPlaceBrandSort } from "./enums/brand.enum";
import { FilterProductsDto } from "./dto/filter-products.dto";
import { MarketplaceHomePageDto } from "./dto/marketplace-home-page.dto";

@Injectable({ scope: Scope.REQUEST })
export class MarketplaceService {
  constructor(
    @Inject(REQUEST) private request: Request,
    private readonly marketplaceFactory: MarketplaceFactory
  ) {}

  async getHomePage(query: MarketplaceHomePageDto) {
    const { id: clientId } = this.request.client;
    console.log({ clientId });

    const paginationDto = {
      page: 0,
      per_page: 10,
    };

    const storefront = await this.marketplaceFactory.checkExistStorefront(
      clientId
    );

    let is_seller = false;
    if (storefront) {
      is_seller = true;
    }

    const categories = await this.marketplaceFactory.findCategories(
      paginationDto
    );

    const brands = await this.marketplaceFactory.findBrands({
      page: paginationDto.page,
      per_page: paginationDto.per_page,
      type: "normal",
      keyword: null,
      sort: MarketPlaceBrandSort.best_seller,
    });

    const top_products = await this.marketplaceFactory.findTopSales(query);
    const sliders = await this.marketplaceFactory.findSliders();
    const top_storefronts = await this.marketplaceFactory.findTopStorefronts(
      query
    );

    return {
      statusCode: HttpStatusCode.Ok,
      message: PublicMessage.OkResponse,
      data: {
        is_seller,
        storefront,
        sliders,
        categories: categories.categories,
        brands: brands.brands,
        top_products,
        top_storefronts,
      },
    };
  }

  async getBrands(query: GetBrands) {
    const brands = await this.marketplaceFactory.findBrands(query);

    return {
      statusCode: HttpStatusCode.Ok,
      message: PublicMessage.OkResponse,
      data: brands,
    };
  }

  async getBrandDetails(brandId: string) {
    const details = await this.marketplaceFactory.getBrandDetails(brandId);

    return {
      statusCode: HttpStatusCode.Ok,
      message: PublicMessage.OkResponse,
      data: details,
    };
  }

  async getCategories(pagination: PaginationDto) {
    const categories = await this.marketplaceFactory.findCategories(pagination);

    return {
      statusCode: HttpStatusCode.Ok,
      message: PublicMessage.OkResponse,
      data: categories,
    };
  }

  async getProducts(query: GetProductsInMarketplaceDto) {
    const products = await this.marketplaceFactory.getProducts(query);

    return {
      statusCode: HttpStatusCode.Ok,
      message: PublicMessage.OkResponse,
      data: products,
    };
  }

  async filteredProducts(query: FilterProductsDto) {
    const products = await this.marketplaceFactory.filteredProducts(query);

    return {
      statusCode: HttpStatusCode.Ok,
      message: PublicMessage.OkResponse,
      data: products,
    };
  }

  async getProductDetails(product_id: string) {
    const result = await this.marketplaceFactory.getProductDetails(product_id);

    return {
      statusCode: HttpStatusCode.Ok,
      message: PublicMessage.OkResponse,
      data: result,
    };
  }
}
