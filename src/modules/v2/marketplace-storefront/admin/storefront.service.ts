import { Injectable } from "@nestjs/common";
import { ClientService } from "src/modules/v2/client/admin/client.service";
import statuses from "src/commons/contracts/Statuses";
import { ListStorefrontsDto } from "./dto/list-storefronts.dto";
import IMetadata from "src/commons/contracts/IMetadata";
import IPagination from "src/commons/contracts/IPagination";
import { RealEstateAgentChangeStatusDto } from "./dto/storefront-change-status.dtop";
import SmsService from "src/modules/services/notifications/sms/SmsService";
import SmsTemplates from "src/commons/contracts/Templates";
import StorefrontPostgresqlRepository from "../repositories/StorefrontPostgresqlRepository";
import RealEstateAgentsCommentsPostgresqlRepository from "src/modules/v2/real-estate-agents-comments/repositories/RealEstateAgentsCommentsPostgresqlRepository";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { MarketplaceStorefrontSort } from "../app/dto/list-storefront.dto";
import { GetTypes } from "../../client/admin/dto/client-list.dto";
import { GetProductDto, GetProductTypes } from "../app/dto/get-product.dto";
import sortingTypes from "src/commons/contracts/SortingTypes";
import RealEstateAdMediaType from "src/commons/contracts/RealEstateAdMediaType";
import RealEstateAdMediaTypePriorities from "src/commons/contracts/RealEstateAdMediaTypePriorities";

@Injectable()
export class StorefrontService {
  private readonly smsService: SmsService;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly storefrontsPostgresRepository: StorefrontPostgresqlRepository,
    private readonly commentsPostgresqlRepository: RealEstateAgentsCommentsPostgresqlRepository,
    private readonly clientService: ClientService
  ) {
    this.smsService = new SmsService();
  }

  async listOfStorefronts(query: ListStorefrontsDto) {
    try {
      let condition = {};
      if (query.status === statuses.pending) {
        condition = {
          status: statuses.inactive,
          OR: [
            { license_status: statuses.pending },
            { license_status: statuses.rejected },
          ],
        };
      } else if (query.status === statuses.active) {
        condition = {
          status: statuses.active,
          license_status: statuses.approved,
        };
      } else if (query.status === statuses.inactive) {
        condition = {
          status: statuses.inactive,
        };
      } else if (query.status === statuses.rejected) {
        condition = {
          status: statuses.inactive,
          license_status: statuses.rejected,
        };
      } else if (query.status === statuses.approved) {
        condition = {
          status: statuses.active,
          license_status: statuses.approved,
        };
      } else {
        condition = {};
      }

      let orderBy = {};
      if (query.sort == MarketplaceStorefrontSort.newest) {
        orderBy = {
          created_at: "desc",
        };
      } else if (query.sort == MarketplaceStorefrontSort.oldest) {
        orderBy = {
          created_at: "asc",
        };
      } else if (query.sort == MarketplaceStorefrontSort.best_selling) {
        orderBy = {
          number_of_sales: "desc",
        };
      } else if (query.sort == MarketplaceStorefrontSort.most_chosen) {
        orderBy = {
          number_of_sales: "desc",
          // score: "desc"
        };
      }

      if (query.type === GetTypes.search) {
        condition = {
          OR: [
            {
              name: {
                contains: query.keyword,
                mode: "insensitive",
              },
            },
            {
              phone: {
                contains: query.keyword,
                mode: "insensitive",
              },
            },
            {
              client: {
                phone: {
                  contains: query.keyword,
                  mode: "insensitive",
                },
              },
            },
          ],
        };
      }

      const count = await this.storefrontsPostgresRepository.count(condition);
      const total = this.getTotalPageNumber(
        Number(count),
        Number(query.per_page)
      );

      const paginationValue = this.makePagination(
        Number(query.page),
        Number(query.per_page)
      );

      const list = await this.prismaService.storefront.findMany({
        where: { ...condition },
        select: {
          id: true,
          name: true,
          description: true,
          avatar: true,
          license: true,
          license_status: true,
          status: true,
          score: true,
          number_of_sales: true,
          number_of_products: true,
          client_id: true,
          created_at: true,
          province: { select: { id: true, name: true } },
          city: { select: { id: true, name: true } },
          client: {
            select: { id: true, name: true, surname: true, phone: true },
          },
        },
        orderBy,
        skip: paginationValue.offset,
        take: paginationValue.per_page,
      });
      return {
        status: 200,
        list,
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

  async findStorefrontProducts(body: GetProductDto) {
    try {
      const storefrontInfo = await this.prismaService.storefront.findFirst({
        where: { id: body.storefront_id },
      });
      if (!storefrontInfo) {
        return { status: 400 };
      }

      let condition: any = { storefrontId: body.storefront_id };
      if (body.status !== statuses.all) {
        condition = {
          ...condition,
          status: body.status,
        };
      }
      if (body.type === GetProductTypes.search) {
        condition = {
          ...condition,
          title: {
            contains: body.keyword,
            mode: "insensitive",
          },
        };
      }

      const count = await this.storefrontsPostgresRepository.countProduct(
        condition
      );

      const total = this.getTotalPageNumber(
        Number(count),
        Number(body.per_page)
      );

      const paginationValue = this.makePagination(
        Number(body.page),
        Number(body.per_page)
      );

      let orderBy: any = { createdAt: "desc" };
      if (body.sort === sortingTypes.newest) {
        orderBy = { createdAt: "desc" };
      } else if (body.sort === sortingTypes.oldest) {
        orderBy = { createdAt: "asc" };
      } else if (body.sort === sortingTypes.most_expensive) {
        orderBy = { price: "desc" };
      } else if (body.sort === sortingTypes.cheapest) {
        orderBy = { price: "asc" };
      }

      console.log({ condition });
      console.log({ orderBy });

      const list = await this.storefrontsPostgresRepository.findManyProducts({
        where: {
          ...condition,
        },
        select: {
          id: true,
          category: { select: { id: true, title: true } },
          subCategory: { select: { id: true, title: true } },
          brand: { select: { id: true, title: true } },
          trackingCode: true,
          title: true,
          description: true,
          status: true,
          price: true,
          unitOfSales: true,
          hasDiscount: true,
          discountedPrice: true,
          colors: true,
          files: {
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
        skip: paginationValue.offset,
        take: paginationValue.per_page,
      });

      return {
        list,
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

  async changeStatus(query: RealEstateAgentChangeStatusDto) {
    try {
      let status = statuses.inactive;
      let license_status = statuses.rejected;

      const storefrontInfo = await this.storefrontsPostgresRepository.findOne({
        id: query.item_id,
      });

      const owner = await this.clientService.findOneByID(
        storefrontInfo.client_id
      );

      if (query.status === statuses.approved) {
        // change status: active and license_status: approved
        await this.storefrontsPostgresRepository.updateOne(
          { id: query.item_id },
          { status: statuses.active, license_status: statuses.approved }
        );

        status = statuses.active;
        license_status = statuses.approved;

        // add role in clients table for owner

        // send sms for owner
        await this.smsService.send({
          recipient: owner.phone,
          templateID: Number(SmsTemplates.change_status_storefront),
          parameterKey: "STOREFRONT_NAME",
          message: storefrontInfo.name + " تایید شد ",
        });
      } else {
        // remove estate_agent role in clients table for owner

        /*         const client_roles = owner.roles;
        client_roles.splice(owner.roles.indexOf(UserTypes.estate_agent), 1);
        await this.clientService.updateOne(
          { id: owner.id },
          { roles: { set: client_roles } }
        ); */

        // send sms for owner
        await this.smsService.send({
          recipient: owner.phone,
          templateID: Number(SmsTemplates.change_status_storefront),
          parameterKey: "STOREFRONT_NAME",
          message: storefrontInfo.name + " رد شد ",
        });

        // change status: inactive and license_status: rejected
        await this.storefrontsPostgresRepository.updateOne(
          { id: query.item_id },
          { status: statuses.inactive, license_status: statuses.rejected }
        );
      }

      return { status: 200, client_status: status, license_status };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  async findOneByID(item_id: number) {
    return await this.prismaService.realEstateAgents.findFirst({
      where: { id: item_id },
      select: { id: true, name: true },
    });
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
