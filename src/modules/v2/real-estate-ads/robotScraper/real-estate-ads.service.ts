import statuses from "src/commons/contracts/Statuses";
import RealEstateAdMediaType from "src/commons/contracts/RealEstateAdMediaType";
import RealEstateAdMediaTypePriorities from "src/commons/contracts/RealEstateAdMediaTypePriorities";
import { Injectable } from "@nestjs/common";
import UploadService from "src/modules/services/UploadService";
import { PrismaService } from "src/../prisma/prisma.service";
import {
  CreateRealEstateAdRobotScraperDto,
  DownloadFileUrl,
} from "./dto/create-real-estate-roborScraper-ads.dto";

@Injectable()
export class RealEstateAdsService_robotScraper {
  private readonly uploadService: UploadService;

  constructor(private readonly prismaService: PrismaService) {
    this.uploadService = new UploadService();
  }

  async storeAd(body: CreateRealEstateAdRobotScraperDto) {
    try {
      body.tracking_code = await this.generateTrackingCode();
      const newItem = await this.prismaService.realEstateAds.create({
        data: {
          category: { connect: { id: body.category } },
          subCategory: { connect: { id: body.sub_category } },
          province: { connect: { id: body.province } },
          city: { connect: { id: body.city } },
          tag: body.tag,
          owner_name: body.owner_name,
          owner_phone: body.owner_phone,
          seller_type: body.seller_type,
          tracking_code: body.tracking_code,
          title: body.title,
          description: body.description,
          is_applicant: body.is_applicant,
          year_built: body.year_built,
          size: body.size,
          sale_price: body.sale_price,
          deposit_price: body.deposit_price,
          rent_price: body.rent_price,
          number_of_rooms: body.number_of_rooms,
          max_capicity: body.max_capicity,
          normal_days_price: body.normal_days_price,
          weekend_price: body.weekend_price,
          special_days_price: body.special_days_price,
          cost_per_additional_person: body.cost_per_additional_person,
          extra_people: body.extra_people,
          lat_item: body.latitude,
          long_item: body.longitude,
          area: body.area,
          status: statuses.inactive,
        },
        select: {
          id: true,
          category: true,
          subCategory: true,
          title: true,
          status: true,
          province: true,
          city: true,
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
              thumbnail: true,
            },
          },
        },
      });

      // save items
      if (body.items.length) {
        body.items.map(async (item, index) => {
          console.log({ item });
          await this.prismaService.realEstateAdItems_sample_robotScraper.create(
            {
              data: {
                RealEstateAds: { connect: { id: Number(newItem.id) } },
                field_name: item.field_name,
                value: item.value,
              },
            }
          );
        });
      }

      // save media
      const dest = "/real_estate_ads/scraper/";
      if (body.media.length) {
        body.media.map(async (item) => {
          const downloadedFile = await this.uploadService.downloadFile(
            item.file_name,
            "GET",
            dest
          );

          if (downloadedFile) {
            await this.prismaService.realEstateAdvertisements.create({
              data: {
                advertisement: { connect: { id: newItem.id } },
                file_name: downloadedFile.fileUrl,
                thumbnail: downloadedFile.fileUrl,
                file_type: item.file_type,
                sort_number: item.sort_number,
                priority: item.priority,
              },
            });
          }
        });
      }

      return { status: 201, result: { id: newItem.id } };
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

  public async downloadFile(body: DownloadFileUrl) {
    return await this.uploadService.downloadFile(body.url, "GET", body.dest);
  }

  private async generateTrackingCode(): Promise<string> {
    // const uniqueCode = randomBytes(6).toString("hex").toUpperCase();
    const uniqueCode =
      "SC_" + (Math.random() * (100000000 - 1000000) + 1000000).toFixed(0);
    const isCodeUnique = await this.prismaService.realEstateAds.findFirst({
      where: { tracking_code: uniqueCode },
    });

    if (isCodeUnique) {
      return this.generateTrackingCode();
    }

    return uniqueCode;
  }
}
