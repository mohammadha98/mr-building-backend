import { Injectable } from "@nestjs/common";
import { Storefront } from "@prisma/client";
import { StorefrontService } from "../../../marketplace-storefront/app/storefront.service";
import { MarketplaceCategoriesService } from "../../../marketplace-categories/marketplace-categories.service";
import Statuses from "src/commons/contracts/Statuses";
import { MarketplaceBrandsService } from "../../../marketplace-brands/marketplace-brands.service";
import { SliderService } from "../../../slider/slider.service";
import { PaginationDto } from "src/commons/dto/pagination.dto";
import { GetProductsInMarketplaceDto } from "../dto/get-products.dto";
import { GetBrands } from "../dto/brands.dto";
import { MarketPlaceBrandSort } from "../enums/brand.enum";
import { FilterProductsDto } from "../dto/filter-products.dto";
import { MarketplaceHomePageDto } from "../dto/marketplace-home-page.dto";

@Injectable()
export class MarketplaceFactory {
  constructor(
    private readonly storefrontService: StorefrontService,
    private readonly categoriesService: MarketplaceCategoriesService,
    private readonly brandsService: MarketplaceBrandsService,
    private readonly sliderService: SliderService
  ) {}

  public async checkExistStorefront(
    clientId: number
  ): Promise<Partial<Storefront> | null> {
    return this.storefrontService.findByClientId(clientId);
  }

  public async findCategories(pagination: PaginationDto | null) {
    return this.categoriesService.findActives(pagination as any, {
      status: Statuses.active,
    });
  }

  public async findBrands(query: GetBrands) {
    let where: any = { status: Statuses.active };
    if (query.type === "search") {
      where.title = {
        contains: query.keyword,
        mode: "insensitive",
      };
    }

    let orderBy: any = { createdAt: "desc" };
    if (query.sort === MarketPlaceBrandSort.best_seller) {
      orderBy = { number_of_sales: "desc" };
    }

    return this.brandsService.findActives(
      { page: query.page, per_page: query.per_page },
      where,
      orderBy
    );
  }

  public async getBrandDetails(brandId: string) {
    return this.brandsService.getDetails(brandId);
  }

  public async findSliders() {
    return this.sliderService.getSliders("marketplace_home");
  }

  public async findTopSales(query: MarketplaceHomePageDto) {
    return this.storefrontService.findTopSales(query, 0, 10);
  }

  public async getProducts(query: GetProductsInMarketplaceDto) {
    return this.storefrontService.getProducts(query);
  }

  public async filteredProducts(query: FilterProductsDto) {
    return this.storefrontService.filteredProducts(query);
  }

  public async getProductDetails(product_id: string) {
    const product = await this.storefrontService.getProductDetails(product_id);
    const comments = [];

    return { product, comments };
  }

  public async findTopStorefronts(query: MarketplaceHomePageDto) {
    return await this.storefrontService.findTopStorefronts(query, 0, 10);
  }
}
