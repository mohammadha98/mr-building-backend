import RealEstateAdsPostgresqlRepository from "../repositories/RealEstateAdsPostgresqlRepository";
import { ClientService } from "src/modules/v1/client/app/client.service";
import RealEstateAdTypes from "src/commons/contracts/RealEstateAdTypes";
import { GetDetailsRealEstateAdItemsDto } from "./dto/get-details-real-estate-ads.dto";
import statuses from "src/commons/contracts/Statuses";
import RealEstateAdMediaType from "src/commons/contracts/RealEstateAdMediaType";
import RealEstateAdMediaTypePriorities from "src/commons/contracts/RealEstateAdMediaTypePriorities";
import SortingTypes from "src/commons/contracts/SortingTypes";
import IMetadata from "src/commons/contracts/IMetadata";
import IPagination from "src/commons/contracts/IPagination";

import RealEstateAdSellerTypes from "src/commons/contracts/RealEstateAdSellerTypes";
import { FilteredDto } from "./dto/filtered.dto";
import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  Scope,
} from "@nestjs/common";
import { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import RealEstateAdsTransformer from "./Transformer";
import UploadService from "src/modules/services/UploadService";
import { PrismaService } from "../../../../../prisma/prisma.service";
import MailerService from "src/modules/services/notifications/mailer/mailerService";
import { AdsDetailTags } from "../app/dto/get-details-real-estate-ads.dto";
import {
  GetRealEstateAdDto,
  SelectedAdStatus,
} from "../app/dto/get-real-estate-ads.dto";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { PublicMessage } from "src/commons/enums/messages";

@Injectable({ scope: Scope.REQUEST })
export class RealEstateAdsService {
  private readonly uploadService: UploadService;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(REQUEST) private readonly request: Request,
    private readonly realEstateAdsPostgresqlRepository: RealEstateAdsPostgresqlRepository,
    private readonly clientService: ClientService,
    private readonly realEstateAdsTransformer: RealEstateAdsTransformer,
    private readonly prismaService: PrismaService,
    private readonly mailerService: MailerService
  ) {
    this.uploadService = new UploadService();
  }

  async findDetails(query: GetDetailsRealEstateAdItemsDto) {
    console.log("*** findDetails : SITE ***");

    let where = {};
    let resourceKey = `ad_details__${query.tracking_code}`;

    if (query.tracking_code) {
      where = { tracking_code: query.tracking_code };
    } else {
      resourceKey = `ad_details__${query.item_id}`;
      where = { id: Number(query.item_id) };
    }

    console.log({ resourceKey });
    let single: any = await this.cacheManager.get(resourceKey);

    if (!single) {
      const transformer = await this.adDetail(where);

      await this.cacheManager.set(resourceKey, {
        ...transformer,
      });
      single = transformer;
    }

    return {
      statusCode: HttpStatus.OK,
      message: PublicMessage.OkResponse,
      data: single,
    };
  }

  private async adDetail(where) {
    const result = await this.realEstateAdsPostgresqlRepository.findOne({
      where,
      select: {
        id: true,
        category: { select: { id: true, title: true, type: true } },
        subCategory: { select: { id: true, title: true } },
        tracking_code: true,
        tag: true,
        owner_name: true,
        owner_phone: true,
        robotAdItems: true,
        display_contact: true,
        seller_type: true,
        is_applicant: true,
        client_id: true,
        agent_id: true,
        advisor_id: true,
        title: true,
        description: true,
        lat_item: true,
        long_item: true,
        agent_valuation_request: true,
        price_status: true,
        price_rating: true,
        status: true,
        is_timed: true,
        expired_at: true,
        created_at: true,
        province: { select: { id: true, name: true } },
        city: { select: { id: true, name: true } },
        area: true,
        sale_price: true,
        deposit_price: true,
        rent_price: true,
        number_of_rooms: true,
        max_capicity: true,
        size: true,
        year_built: true,
        normal_days_price: true,
        weekend_price: true,
        special_days_price: true,
        cost_per_additional_person: true,
        extra_people: true,
        RealEstateAdForms: {
          select: {
            id: true,
            value: true,
            form: {
              select: {
                id: true,
                icon: true,
                field_name: true,
                field_type: true,
                values: true,
                sort_number: true,
              },
            },
          },
          orderBy: {
            form: {
              sort_number: "asc",
            },
          },
        },
        media: {
          select: {
            id: true,
            file_name: true,
            file_type: true,
            sort_number: true,
            priority: true,
            thumbnail: true,
          },
        },
      },
    });

    if (result.status === statuses.inactive || !result) {
      throw new BadRequestException();
    }

    let adOwnerInfo;
    if (result.tag === AdsDetailTags.mrbuilding) {
      if (result.seller_type === RealEstateAdSellerTypes.individual) {
        adOwnerInfo = await this.prismaService.client.findFirst({
          where: { id: result.client_id },
        });
        result.owner_info = {
          phone: adOwnerInfo.phone,
          name: adOwnerInfo.name + " " + adOwnerInfo.surname,
          avatar: adOwnerInfo.avatar
            ? `${process.env.APP_CONTENT_PATH}/clients/avatars/${adOwnerInfo.avatar}`
            : "",
        };
        adOwnerInfo = null;
      } else if (
        result.seller_type === RealEstateAdSellerTypes.real_estate_agent
      ) {
        const adminInfo =
          await this.prismaService.realEstateAgentAdmins.findFirst({
            where: {
              agent_id: result.agent_id,
              permissions: { hasSome: "answer_calls" },
            },
            select: {
              client: { select: { phone: true, name: true, avatar: true } },
            },
            orderBy: { id: "desc" },
          });

        const agentInfo = await this.prismaService.realEstateAgents.findUnique({
          where: { id: result.agent_id },
          select: {
            name: true,
            avatar: true,
            client: { select: { phone: true } },
          },
        });

        if (!adminInfo) {
          adOwnerInfo = {
            phone: agentInfo.client.phone,
            name: agentInfo.name,
            agentInfo: agentInfo.avatar,
          };
          result.owner_info = {
            phone: adOwnerInfo.phone,
            name: adOwnerInfo.name,
            avatar: adOwnerInfo.avatar
              ? `${process.env.APP_CONTENT_PATH}/estate-agents/avatars/${adOwnerInfo.avatar}`
              : "",
          };
        } else {
          adOwnerInfo = {
            phone: adminInfo.client.phone,
            name: agentInfo.name,
            avatar: agentInfo.avatar,
          };
          result.owner_info = {
            phone: adOwnerInfo.phone,
            name: adOwnerInfo.name,
            avatar: adOwnerInfo.avatar
              ? `${process.env.APP_CONTENT_PATH}/estate-agents/avatars/${adOwnerInfo.avatar}`
              : "",
          };
        }
      } else if (result.seller_type === RealEstateAdSellerTypes.advisor) {
        adOwnerInfo = await this.prismaService.realEstateAdvisors.findFirst({
          where: { client_id: result.client_id },
          select: {
            phone: true,
            avatar: true,
            client: { select: { name: true, avatar: true, phone: true } },
            real_estate_agent: {
              select: { id: true, phone: true, name: true, avatar: true },
            },
          },
        });

        result.owner_info = {
          phone: adOwnerInfo.client.phone,
          name: adOwnerInfo.real_estate_agent.name,
          avatar: adOwnerInfo.real_estate_agent.avatar
            ? `${process.env.APP_CONTENT_PATH}/estate-agents/avatars/${adOwnerInfo.real_estate_agent.avatar}`
            : "",
        };
      }
    }

    // result = await this.getAdOwnerInfo(result);
    return this.realEstateAdsTransformer.transformDetails(result);
  }

  async findAds(query: any) {
    try {
      query.ip_address = this.request.ip_address as string;

      // TODO test log
      console.log("*** find Ads: APP ***");
      console.log({ query });

      const resourceKey = this.generateRedisKey(query);
      const { condition, Reasons } = this.generateConditionFoFindAds(query);

      let result: any = await this.cacheManager.get(resourceKey);
      let total = result ? result.length : 0;
      if (!result) {
        const count = await this.realEstateAdsPostgresqlRepository.count(
          condition
        );
        total = this.getTotalPageNumber(Number(count), Number(query.per_page));

        const paginationValue = this.makePagination(
          Number(query.page),
          Number(query.per_page)
        );

        console.log({ condition });
        result = await this.realEstateAdsPostgresqlRepository.findMany({
          ...condition,
          skip: paginationValue.offset,
          take: paginationValue.per_page,
          select: {
            id: true,
            Reasons,
            category: { select: { id: true, title: true, type: true } },
            subCategory: { select: { id: true, title: true } },
            tracking_code: true,
            owner_name: true,
            owner_phone: true,
            tag: true,

            title: true,
            is_applicant: true,
            status: true,
            province: { select: { id: true, name: true } },
            city: { select: { id: true, name: true } },
            agent_id: true,
            advisor_id: true,
            seller_type: true,
            area: true,
            sale_price: true,
            deposit_price: true,
            rent_price: true,
            number_of_rooms: true,
            max_capicity: true,
            normal_days_price: true,
            created_at: true,
            media: {
              where: {
                file_type: RealEstateAdMediaType.image,
                priority: RealEstateAdMediaTypePriorities.primary,
              },
              take: 1,
              orderBy: { id: "desc" },
              select: {
                id: true,
                file_name: true,
                file_type: true,
                sort_number: true,
                priority: true,
                ad_id: true,
                thumbnail: true,
              },
            },
          },
        });

        result = await Promise.all(
          result.map(async (item: any) => {
            return await this.getAdOwnerInfo(item);
          })
        );

        const transformer = this.realEstateAdsTransformer.collectionAdList(
          result
        ) as any;

        result = transformer;
        console.log("*** Save Ads List Into Cache ***");
        await this.cacheManager.set(resourceKey, result);
      } else {
        console.log("*** Get Ads List From Cache ***");
      }

      console.log({ resourceKey });

      return {
        status: 200,
        result,
        metadata: this.makeMetadata(
          Number(query.page),
          Number(query.per_page),
          Number(total)
        ),
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  private generateRedisKey(query: any) {
    let resourceKey = null;
    if (query.tag === "all") {
      resourceKey = `tag_${query.tag}_sort_${query.sort}_ip_address_${query.ip_address}_provinceId_${query.province_id}_city_id_${query.city_id}_page_${query.page}`;
    } else if (query.tag === "individual") {
      resourceKey = `tag_${query.tag}_province_id_${query.province_id}_city_id_${query.city_id}_ip_address_${query.ip_address}_page_${query.page}`;
    } else if (query.tag === RealEstateAdSellerTypes.real_estate_agent) {
      resourceKey = `tag_${query.tag}_sort_${query.sort}_ip_address_${query.ip_address}_page_${query.page}_category_id_${query.category_id}_sub_category_id_${query.sub_category_id}_provinceId_${query.province_id}_city_id_${query.city_id}`;
    } else if (query.tag === RealEstateAdSellerTypes.advisor) {
      resourceKey = `tag_${query.tag}_ip_address_${query.ip_address}_sort_${query.sort}_page_${query.page}_category_id_${query.category_id}_sub_category_id_${query.sub_category_id}_provinceId_${query.province_id}_city_id_${query.city_id}`;
    } else if (query.tag === "search") {
      resourceKey = `tag_${query.tag}_ip_address_${query.ip_address}_sort_${query.sort}_provinceId_${query.province_id}_city_id_${query.city_id}_page_${query.page}`;
    }
    return resourceKey;
  }

  private generateConditionFoFindAds(query: GetRealEstateAdDto) {
    // conditions
    let condition: { where: any; orderBy: any } = {
      where: {},
      orderBy: {},
    };
    let Reasons = false;
    if (query.tag === SelectedAdStatus.individual) {
      condition.where = {
        seller_type: query.tag,
        province_id: +query.province_id,
      };

      if (query.city_id) {
        condition.where = {
          ...condition.where,
          city_id: +query.city_id,
        };
      }
    } else if (query.tag === "all") {
      condition.where = {
        status: statuses.approved,
        province_id: +query.province_id,
      };

      if (query.city_id) {
        condition.where.city_id = +query.city_id;
      }
    } else if (query.tag === "real_estate_agent") {
      Reasons = true;
      condition.where = {
        province_id: +query.province_id,
        OR: [
          { seller_type: RealEstateAdSellerTypes.real_estate_agent },
          { seller_type: RealEstateAdSellerTypes.advisor },
        ],
        status: statuses.approved,
      };
    } else if (query.tag === "advisor") {
      condition.where = {
        seller_type: RealEstateAdSellerTypes.advisor,
        province_id: +query.province_id,
        status: statuses.approved,
      };
    } else if (query.tag === SelectedAdStatus.search) {
      condition.where = {
        status: statuses.approved,
        province_id: query.province_id ? Number(query.province_id) : undefined,
        title: {
          contains: query.keyword,
          mode: "insensitive",
        },
      };
    }

    if (query.category_id) {
      condition.where = {
        ...condition.where,
        categoryId: query.category_id,
      };
    }
    if (query.sub_category_id) {
      condition.where = {
        ...condition.where,
        subCategoryId: query.sub_category_id,
      };
    }

    if (query.status !== statuses.all) {
      condition.where.status = query.status;
    } else {
      condition.where.status = {
        not: statuses.deleted,
      };
    }

    // sorting ads
    condition = this.makeSortAds(condition, query.sort, query.type, query.tag);

    return { condition, Reasons };
  }

  private makeSortAds(condition: any, sort: string, type: string, tag: string) {
    if (tag === SelectedAdStatus.me) {
      return condition;
    }

    if (sort === SortingTypes.newest) {
      condition.orderBy = { created_at: "desc" };
    } else if (sort === SortingTypes.oldest) {
      condition.orderBy = { created_at: "asc" };
    } else if (sort === SortingTypes.most_expensive) {
      if (type === RealEstateAdTypes.sale) {
        condition.orderBy = { sale_price: "desc" };
      } else if (type === RealEstateAdTypes.rent) {
        condition.orderBy = [{ deposit_price: "desc" }, { rent_price: "desc" }];
      } else if (type === RealEstateAdTypes.participation) {
        condition.orderBy = [
          { normal_days_price: "desc" },
          { weekend_price: "desc" },
          { special_days_price: "desc" },
        ];
      }
    } else if (sort === SortingTypes.cheapest) {
      if (type === RealEstateAdTypes.sale) {
        condition.orderBy = { sale_price: "asc" };
      } else if (type === RealEstateAdTypes.rent) {
        condition.orderBy = [{ deposit_price: "asc" }, { rent_price: "asc" }];
      } else if (type === RealEstateAdTypes.participation) {
        condition.orderBy = [
          { normal_days_price: "asc" },
          { weekend_price: "asc" },
          { special_days_price: "asc" },
        ];
      }
    }

    return condition;
  }

  private async getAdOwnerInfo(ad) {
    const adInfo = ad;
    adInfo.owner_info = null;

    if (ad.seller_type === RealEstateAdSellerTypes.real_estate_agent) {
      const agentInfo = await this.prismaService.realEstateAgents.findFirst({
        where: { id: ad.agent_id },
        select: { name: true, avatar: true },
      });
      adInfo.owner_info = {
        name: agentInfo.name,
        avatar: agentInfo.avatar
          ? `${process.env.APP_CONTENT_PATH}/estate-agents/avatars/${agentInfo.avatar}`
          : "",
      };
    } else if (ad.seller_type === RealEstateAdSellerTypes.advisor) {
      const advisorInfo = await this.prismaService.realEstateAdvisors.findFirst(
        {
          where: { id: ad.advisor_id },
          select: {
            real_estate_agent: { select: { name: true, avatar: true } },
          },
        }
      );
      adInfo.owner_info = {
        name: advisorInfo.real_estate_agent.name,
        avatar: advisorInfo.real_estate_agent.avatar
          ? `${process.env.APP_CONTENT_PATH}/estate-agents/avatars/${advisorInfo.real_estate_agent.avatar}`
          : "",
      };
    }

    return adInfo;
  }

  async filteredAds(body: FilteredDto) {
    try {
      const {
        type,
        sale_price,
        deposit_price,
        normal_days_price,
        number_of_rooms,
        max_capicity,
        rent_price,
        size,
        year_built,
        items,
        has_video,
      } = body;

      let orderBy: {};
      let where: any;

      if (body.category_id) {
        where = {
          categoryId: body.category_id,
        };
      }
      if (body.sub_category_id.length > 0) {
        where = {
          ...where,
          subCategoryId: body.sub_category_id,
        };
      }

      where = {
        ...where,
        status: "approved",
        province_id: body.province_id,
        is_applicant: body.is_applicant,
        has_video,
        AND: [
          {
            size: {
              gte: size.from || 0,
              lte: size.to || 99999999,
            },
          },
          {
            year_built: {
              gte: year_built.from || 1300,
              lte: year_built.to || 1600,
            },
          },
          ...(items && items.length > 0
            ? [
                {
                  RealEstateAdForms: {
                    some: {
                      OR: items.map((item) => ({
                        form_id: item.id,
                        value: String(item.value),
                      })),
                    },
                  },
                },
              ]
            : []),
        ],
      };

      if (body.sort === SortingTypes.newest) {
        orderBy = { id: "desc" };
      } else if (body.sort === SortingTypes.oldest) {
        orderBy = { id: "asc" };
      } else if (body.sort === SortingTypes.cheapest) {
        orderBy = { sale_price: "asc" };
      } else if (body.sort === SortingTypes.most_expensive) {
        orderBy = { sale_price: "desc" };
      }

      if (body.tag === "general_ads") {
        where = {
          ...where,
          seller_type: RealEstateAdSellerTypes.individual,
        };
      } else if (body.tag === "general_real_estate_agent") {
        where = {
          ...where,
          OR: [
            { seller_type: RealEstateAdSellerTypes.real_estate_agent },
            { seller_type: RealEstateAdSellerTypes.advisor },
          ],
        };
      }

      if (type === RealEstateAdTypes.sale) {
        where = {
          ...where,
          AND: [
            ...where.AND,
            {
              sale_price: {
                gte: sale_price.from || 0,
                lte: sale_price.to || 999999999999999,
              },
            },
          ],
        };
      } else if (type === RealEstateAdTypes.rent) {
        where = {
          ...where,
          AND: [
            ...where.AND,
            {
              deposit_price: {
                gte: deposit_price.from || 0,
                lte: deposit_price.to || 999999999999999,
              },
            },
            {
              rent_price: {
                gte: rent_price.from || 0,
                lte: rent_price.to || 999999999999999,
              },
            },
          ],
        };
      } else if (type === RealEstateAdTypes.short_rent) {
        where = {
          ...where,
          AND: [
            ...where.AND,
            {
              normal_days_price: {
                gte: normal_days_price.from || 0,
                lte: normal_days_price.to || 999999999999999,
              },
            },
            {
              number_of_rooms: {
                gte: number_of_rooms.from || 0,
                lte: number_of_rooms.to || 1000,
              },
            },
            {
              max_capicity: {
                gte: max_capicity.from || 0,
                lte: max_capicity.to || 1000,
              },
            },
          ],
        };
      }

      console.log("where");
      console.log(where);
      where.AND.map((item) => {
        console.log(item);
      });

      const count = await this.realEstateAdsPostgresqlRepository.count({
        where,
      });
      const total = this.getTotalPageNumber(
        Number(count),
        Number(body.per_page)
      );

      const paginationValue = this.makePagination(
        Number(body.page),
        Number(body.per_page)
      );

      let result = await this.realEstateAdsPostgresqlRepository.findMany({
        where: { ...where },
        skip: paginationValue.offset,
        take: paginationValue.per_page,
        select: {
          id: true,
          category: { select: { id: true, title: true, type: true } },
          subCategory: { select: { id: true, title: true } },
          tracking_code: true,
          title: true,
          is_applicant: true,
          status: true,
          size: true,
          year_built: true,
          province: { select: { id: true, name: true } },
          city: { select: { id: true, name: true } },
          agent_id: true,
          advisor_id: true,
          seller_type: true,
          area: true,
          sale_price: true,
          deposit_price: true,
          rent_price: true,
          number_of_rooms: true,
          max_capicity: true,
          normal_days_price: true,
          media: {
            where: {
              file_type: RealEstateAdMediaType.image,
              priority: RealEstateAdMediaTypePriorities.primary,
            },
            select: {
              id: true,
              file_name: true,
              file_type: true,
              sort_number: true,
              priority: true,
            },
          },
        },
        orderBy,
      });

      console.log("**********");
      console.log("result.length");
      console.log(result.length);
      console.log("**********");

      if (!result) {
        return { status: 400 };
      }

      result = await Promise.all(
        result.map(async (item: any) => {
          return await this.getAdOwnerInfo(item);
        })
      );

      return {
        status: 200,
        result,
        metadata: this.makeMetadata(
          Number(body.page),
          Number(body.per_page),
          Number(total)
        ),
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  public async getCategories() {
    try {
      const result = await this.prismaService.realEstateAdMainCategory.findMany(
        {
          where: {
            status: statuses.active,
          },
          select: {
            id: true,
            title: true,
            status: true,
            type: true,
            RealEstateAdSubCategory: {
              select: {
                id: true,
                title: true,
                form: {
                  select: {
                    items: {
                      select: {
                        id: true,
                        field_name: true,
                        is_active: true,
                        required: true,
                        field_type: true,
                        values: true,
                        icon: true,
                      },
                      orderBy: { sort_number: "asc" },
                    },
                  },
                },
              },
            },
          },
          orderBy: { id: "asc" },
        }
      );

      return {
        status: 200,
        result,
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  // make metadata
  private makeMetadata(
    page: number,
    per_page: number,
    total_page: number
  ): IMetadata {
    return {
      page,
      total_page,
      per_page: per_page,
      next: page < total_page,
      back: page > 1,
    };
  }

  // make metadata
  private makePagination(page: number, per_page: number): IPagination {
    return {
      offset: (page - 1) * per_page,
      per_page,
    };
  }

  private getTotalPageNumber(total_number: number, per_page: number) {
    return Math.ceil(total_number / per_page);
  }
}
