import { Injectable } from "@nestjs/common";
import IPagination from "src/commons/contracts/IPagination";
import IRealEstateAdsRepository from "./IRealEstateAdsRepository";
import { PrismaService } from "../../../../../prisma/prisma.service";
import RealEstateAdMediaType from "src/commons/contracts/RealEstateAdMediaType";
import RealEstateAdMediaTypePriorities from "src/commons/contracts/RealEstateAdMediaTypePriorities";
import {
  DeleteRealEstateMediaItemDto,
  RealEstateMediaItemTypes,
} from "../app/dto/delete-media-item.dto";
import statuses from "src/commons/contracts/Statuses";

@Injectable()
export default class RealEstateAdsPostgresqlRepository
  implements IRealEstateAdsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async createItem(params: any): Promise<any> {
    try {
      return await this.prisma.realEstateAdFormValue.create(params);
    } catch (error) {
      console.log("* Error in Store Ad: createItem *");
      console.log(error);
      return false;
    }
  }

  async changeStatus(where: any, data: any): Promise<any> {
    try {
      return await this.prisma.realEstateAds.update({ where, data });
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async createMedia(params: any): Promise<any> {
    return await this.prisma.realEstateAdvertisements.create(params);
  }

  async getMedia(ad_id: number): Promise<any[]> {
    return await this.prisma.realEstateAdvertisements.findMany({
      where: { ad_id },
    });
  }

  async removeMedia(item_id: number): Promise<any> {
    return await this.prisma.realEstateAdvertisements.delete({
      where: { id: item_id },
    });
  }

  async removeAllMedia(ad_id: number): Promise<any> {
    return await this.prisma.realEstateAdvertisements.deleteMany({
      where: { ad_id },
    });
  }

  async removeItems(ad_id: number): Promise<any> {
    return await this.prisma.realEstateAdFormValue.deleteMany({
      where: { ad_id },
    });
  }

  async deleteManyItems(ad_id: number): Promise<any> {
    return await this.prisma.realEstateAdFormValue.deleteMany({
      where: { ad_id },
    });
  }

  public async SaveRealEstateAdsTempFiles(
    file_type: string,
    file: string,
    thumbnail: string
  ) {
    return await this.prisma.realEstateAdsTempFiles.create({
      data: {
        file_type: file_type,
        file_name: file,
        thumbnail,
      },
      select: {
        id: true,
        file_name: true,
        file_type: true,
        thumbnail: true,
      },
    });
  }

  public async changePriorityFilesToNormal(ad_id: number) {
    await this.prisma.realEstateAdvertisements.updateMany({
      where: {
        ad_id: Number(ad_id),
        priority: RealEstateAdMediaTypePriorities.primary,
      },
      data: { priority: RealEstateAdMediaTypePriorities.normal },
    });
  }

  public async saveMedia(
    ad_id: number,
    file_type: string,
    file: string,
    thumbnail: string
  ) {
    return await this.prisma.realEstateAdvertisements.create({
      data: {
        file_type: file_type,
        file_name: file,
        advertisement: { connect: { id: Number(ad_id) } },
        priority: RealEstateAdMediaTypePriorities.primary,
        thumbnail,
      },
      select: {
        id: true,
        file_name: true,
        file_type: true,
        thumbnail: true,
      },
    });
  }

  async findMedia(id: number): Promise<any> {
    return await this.prisma.realEstateAdvertisements.findFirst({
      where: { id },
    });
  }

  async getFileInfo(query: DeleteRealEstateMediaItemDto): Promise<any> {
    try {
      let fileInfo;
      if (query.type === RealEstateMediaItemTypes.temp) {
        fileInfo = await this.prisma.realEstateAdsTempFiles.findFirst({
          where: { id: Number(query.item_id) },
        });
      } else {
        fileInfo = await this.prisma.realEstateAdvertisements.findFirst({
          where: { id: Number(query.item_id) },
        });
      }
      return fileInfo;
    } catch (error) {
      return false;
    }
  }

  async deleteTempFile(id: number): Promise<any> {
    return await this.prisma.realEstateAdsTempFiles.delete({
      where: { id },
    });
  }

  async count(params: any): Promise<number> {
    return await this.prisma.realEstateAds.count(params);
  }

  async findByStatus(status: string): Promise<any[] | []> {
    return await this.prisma.realEstateAds.findMany({
      where: { status },
    });
  }

  async create(params: any): Promise<any> {
    try {
      return await this.prisma.realEstateAds.create({
        data: {
          category: { connect: { id: params.category_id } },
          subCategory: { connect: { id: params.sub_category_id } },
          client: { connect: { id: Number(params.client_id) } },
          agent_id: params.agent_id,
          advisor_id: params.advisor_id,
          seller_type: params.seller_type,
          tracking_code: params.tracking_code,
          display_contact: params.display_contact,
          title: params.title,
          description: params.description,
          is_applicant: params.is_applicant,
          year_built: params.year_built,
          size: params.size,
          sale_price: params.sale_price,
          deposit_price: params.deposit_price,
          rent_price: params.rent_price,
          number_of_rooms: params.number_of_rooms,
          max_capicity: params.max_capicity,
          normal_days_price: params.normal_days_price,
          weekend_price: params.weekend_price,
          special_days_price: params.special_days_price,
          cost_per_additional_person: params.cost_per_additional_person,
          extra_people: params.extra_people,
          lat_item: params.latitude,
          long_item: params.longitude,
          province: { connect: { id: Number(params.province_id) } },
          city: { connect: { id: Number(params.city_id) } },
          area: params.area,
          status: params.status,
          is_timed: params.is_timed,
          expired_at: params.expired_at,
          agent_valuation_request: params.agent_valuation_request,
        },
        select: {
          id: true,
          category: { select: { id: true, title: true } },
          subCategory: { select: { id: true, title: true } },
          title: true,
          status: true,
          province: { select: { id: true, name: true } },
          city: { select: { id: true, name: true } },
          area: true,
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
      });
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async updateOne(where: any, params: any): Promise<any> {
    return await this.prisma.realEstateAds.update({
      where: where,
      data: {
        category: { connect: { id: params.category_id } },
        subCategory: { connect: { id: params.sub_category_id } },
        agent_id: params.agent_id,
        advisor_id: params.advisor_id,
        seller_type: params.seller_type,
        display_contact: params.display_contact,
        title: params.title,
        description: params.description,
        is_applicant: params.is_applicant,
        year_built: params.year_built,
        size: params.size,
        sale_price: params.sale_price,
        deposit_price: params.deposit_price,
        rent_price: params.rent_price,
        number_of_rooms: params.number_of_rooms,
        max_capicity: params.max_capicity,
        normal_days_price: params.normal_days_price,
        weekend_price: params.weekend_price,
        special_days_price: params.special_days_price,
        cost_per_additional_person: params.cost_per_additional_person,
        extra_people: params.extra_people,
        lat_item: params.latitude,
        long_item: params.longitude,
        province: { connect: { id: Number(params.province_id) } },
        city: { connect: { id: Number(params.city_id) } },
        area: params.area,
        is_timed: params.is_timed,
        expired_at: params.expired_at,
        agent_valuation_request: params.agent_valuation_request,
        status: statuses.pending,
      },
      select: {
        id: true,
        category: { select: { id: true, title: true, type: true } },
        subCategory: { select: { id: true, title: true } },
        tracking_code: true,
        seller_type: true,
        client_id: true,
        agent_id: true,
        advisor_id: true,
        is_applicant: true,
        title: true,
        description: true,
        display_contact: true,
        year_built: true,
        size: true,
        sale_price: true,
        deposit_price: true,
        rent_price: true,
        number_of_rooms: true,
        max_capicity: true,
        normal_days_price: true,
        weekend_price: true,
        special_days_price: true,
        cost_per_additional_person: true,
        extra_people: true,
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
  }

  async findOne(params: any): Promise<any> {
    return await this.prisma.realEstateAds.findFirst(params);
  }

  async findOneByID(id: number): Promise<any> {
    return await this.prisma.realEstateAds.findUnique({
      where: { id },
    });
  }

  async findMany(
    params: any,
    relations?: string[],
    pagination?: IPagination
  ): Promise<any[]> {
    return await this.prisma.realEstateAds.findMany(params);
  }

  async updateMany(
    where: Partial<any>,
    updateData: Partial<any>
  ): Promise<any> {
    return await this.prisma.realEstateAds.updateMany({
      where,
      data: updateData,
    });
  }

  async deleteOne(ad_id: number): Promise<any> {
    return await this.prisma.realEstateAds.delete({ where: { id: ad_id } });
  }

  async deleteMany(where: any): Promise<any> {
    return await this.prisma.realEstateAds.deleteMany({ where });
  }
}
