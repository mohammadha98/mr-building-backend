import { Injectable } from "@nestjs/common";
import IPagination from "src/commons/contracts/IPagination";
import IMarketplaceProductFeatureFormsRepository from "./IMarketplaceProductFeatureFormsRepository";
import { PrismaService } from "../../../../../prisma/prisma.service";

@Injectable()
export default class MarketplaceProductFeatureFormsPostgresqlRepository
  implements IMarketplaceProductFeatureFormsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async saveItem(body: any) {
    return await this.prisma.marketplaceProductFeatures.create({
      data: {
        form: { connect: { id: body.form_id } },
        field_name: body.field_name,
        field_type: body.field_type,
        values: body.values,
      },
      select: {
        id: true,
        field_name: true,
        field_type: true,
        values: true,
        key: true,
      },
    });
  }

  async count(params: any): Promise<number> {
    return await this.prisma.marketplaceProductFeaturesForm.count(params);
  }

  async create(params: any): Promise<any> {
    return await this.prisma.marketplaceProductFeaturesForm.create(params);
  }

  async findOne(params: any): Promise<any> {
    return await this.prisma.marketplaceProductFeaturesForm.findFirst({
      where: params,
    });
  }

  async findOneByID(id: string): Promise<any> {
    return await this.prisma.marketplaceProductFeaturesForm.findUnique({
      where: { id },
    });
  }

  async findMany(
    params: any,
    relations?: string[],
    pagination?: IPagination
  ): Promise<any[]> {
    return await this.prisma.marketplaceProductFeaturesForm.findMany(params);
  }

  async updateOne(where: any, updateData: any): Promise<any> {
    return await this.prisma.marketplaceProductFeaturesForm.update({
      where,
      data: updateData,
    });
  }

  async updateMany(
    where: Partial<any>,
    updateData: Partial<any>
  ): Promise<any> {
    return await this.prisma.marketplaceProductFeaturesForm.updateMany({
      where,
      data: updateData,
    });
  }

  async deleteOne(where: any): Promise<any> {
    return await this.prisma.marketplaceProductFeaturesForm.delete({ where });
  }

  async deleteMany(where: any): Promise<any> {
    return await this.prisma.marketplaceProductFeaturesForm.deleteMany({
      where,
    });
  }

  async findOneItem(params: any): Promise<any> {
    return await this.prisma.marketplaceProductFeatures.findFirst({
      where: params,
    });
  }

  async findManyItems(params: any): Promise<any[]> {
    return await this.prisma.marketplaceProductFeatures.findMany(params);
  }

  async updateOneItem(where: any, updateData: any): Promise<any> {
    return await this.prisma.marketplaceProductFeatures.update({
      where,
      data: updateData,
    });
  }

  async deleteOneItem(where: any): Promise<any> {
    await this.prisma.marketplaceProductFeatureValues.deleteMany({
      where: { featureId: where.id },
    });
    await this.prisma.marketplaceProductFeatures.delete({
      where: { id: where.id },
    });
    return;
  }

  async deleteManyItem(where: any): Promise<any> {
    const items = await this.prisma.marketplaceProductFeatures.findMany({
      where: { formId: where.form_id },
    });

    await items.map(async (item) => {
      await this.prisma.marketplaceProductFeatureValues.deleteMany({
        where: { featureId: item.id },
      });
    });

    await this.prisma.marketPlaceSubCategory.deleteMany({
      where: { formId: where.form_id },
    });
    await this.prisma.marketplaceProductFeatures.deleteMany({
      where: { formId: where.form_id },
    });

    return;
  }
}
