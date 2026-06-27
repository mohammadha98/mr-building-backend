import { Injectable } from "@nestjs/common";
import IPagination from "src/commons/contracts/IPagination";
import IrealEstateAdsSettingsRepository from "./IRealEstateAdsFormsRepository";
import { PrismaService } from "../../../../../prisma/prisma.service";

@Injectable()
export default class RealEstateAdsFormsPostgresqlRepository
  implements IrealEstateAdsSettingsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async saveItem(body: any) {
    return await this.prisma.realEstateAdFormItems.create({
      data: {
        form: { connect: { id: body.form_id } },
        field_name: body.field_name,
        field_type: body.field_type,
        values: body.values,
        icon: body.icon,
      },
      select: {
        id: true,
        field_name: true,
        field_type: true,
        values: true,
        icon: true,
        key: true,
      },
    });
  }

  async count(params: any): Promise<number> {
    return await this.prisma.realEstateAdForm.count(params);
  }

  async create(params: any): Promise<any> {
    return await this.prisma.realEstateAdForm.create(params);
  }

  async findOne(params: any): Promise<any> {
    return await this.prisma.realEstateAdForm.findFirst({ where: params });
  }

  async findOneByID(id: string): Promise<any> {
    return await this.prisma.realEstateAdForm.findUnique({
      where: { id },
    });
  }

  async findMany(
    params: any,
    relations?: string[],
    pagination?: IPagination
  ): Promise<any[]> {
    return await this.prisma.realEstateAdForm.findMany(params);
  }

  async updateOne(where: any, updateData: any): Promise<any> {
    return await this.prisma.realEstateAdForm.update({
      where,
      data: updateData,
    });
  }

  async updateMany(
    where: Partial<any>,
    updateData: Partial<any>
  ): Promise<any> {
    return await this.prisma.realEstateAdForm.updateMany({
      where,
      data: updateData,
    });
  }

  async deleteOne(where: any): Promise<any> {
    return await this.prisma.realEstateAdForm.delete({ where });
  }

  async deleteMany(where: any): Promise<any> {
    return await this.prisma.realEstateAdForm.deleteMany({ where });
  }

  async findOneItem(params: any): Promise<any> {
    return await this.prisma.realEstateAdFormItems.findFirst({ where: params });
  }

  async findManyItems(params: any): Promise<any[]> {
    return await this.prisma.realEstateAdFormItems.findMany(params);
  }

  async updateOneItem(where: any, updateData: any): Promise<any> {
    return await this.prisma.realEstateAdFormItems.update({
      where,
      data: updateData,
    });
  }
  async deleteOneItem(where: any): Promise<any> {
    await this.prisma.realEstateAdFormValue.deleteMany({
      where: { form_id: where.id },
    });
    await this.prisma.realEstateAdFormItems.delete({ where: { id: where.id } });
    return;
  }

  async deleteManyItem(where: any): Promise<any> {
    const items = await this.prisma.realEstateAdFormItems.findMany({
      where: { form_id: where.form_id },
    });
    await items.map(async (item) => {
      await this.prisma.realEstateAdFormValue.deleteMany({
        where: { form_id: item.form_id },
      });
    });

    await this.prisma.realEstateAdSubCategory.deleteMany({
      where: { formId: where.form_id },
    });
    await this.prisma.realEstateAdFormItems.deleteMany({ where });

    return;
  }
}
