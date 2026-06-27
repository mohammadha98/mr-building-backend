import { Injectable } from "@nestjs/common";
import IPagination from "src/commons/contracts/IPagination";
import IRealEstateAgentsRepository from "./IRealEstateAgentsRepository";
import { PrismaService } from "../../../../../prisma/prisma.service";

@Injectable()
export default class RealEstateAgentsPostgresqlRepository
  implements IRealEstateAgentsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async findNewItems(
    params: any,
    select: any,
    pagination?: IPagination
  ): Promise<any[] | []> {
    return await this.prisma.realEstateAgents.findMany({
      where: params,
      select,
      skip: pagination.offset,
      take: pagination.per_page,
    });
  }

  async count(params: any): Promise<number> {
    return await this.prisma.realEstateAgents.count({ where: params });
  }

  async findByStatus(status: string): Promise<any[] | []> {
    return await this.prisma.realEstateAgents.findMany({ where: { status } });
  }

  async create(params: any): Promise<any> {
    try {
      return await this.prisma.realEstateAgents.create({
        data: params,
      });
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async findOne(params: any): Promise<any> {
    return await this.prisma.realEstateAgents.findFirst({ where: params });
  }

  async findOneByID(id: number): Promise<any> {
    return await this.prisma.realEstateAgents.findUnique({ where: { id } });
  }

  async findMany(
    params: any,
    relations?: string[],
    pagination?: IPagination
  ): Promise<any[]> {
    return await this.prisma.realEstateAgents.findMany({
      where: params,
      skip: pagination.offset,
      take: pagination.per_page,
    });
  }

  async updateOne(where: any, updateData: any): Promise<any> {
    try {
      return await this.prisma.realEstateAgents.update({
        where,
        data: updateData,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async updateMany(
    where: Partial<any>,
    updateData: Partial<any>
  ): Promise<any> {
    return await this.prisma.realEstateAgents.updateMany({
      where,
      data: updateData,
    });
  }

  async deleteOne(where: any): Promise<any> {
    return await this.prisma.realEstateAgents.delete({ where });
  }

  async deleteMany(where: any): Promise<any> {
    return await this.prisma.realEstateAgents.deleteMany({ where });
  }
}
