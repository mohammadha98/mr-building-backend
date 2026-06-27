import { Injectable } from "@nestjs/common";
import IPagination from "src/commons/contracts/IPagination";
import IrealEstateAgentCommentsRepository from "./IRealEstateAgentsCommentsRepository";
import { PrismaService } from "../../../../../prisma/prisma.service";

@Injectable()
export default class RealEstateAgentsCommentsPostgresqlRepository
  implements IrealEstateAgentCommentsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async count(params: any): Promise<number> {
    return await this.prisma.realEstateAgentComments.count(params);
  }

  async findByStatus(status: string): Promise<any[] | []> {
    return await this.prisma.realEstateAgentComments.findMany({
      where: { status },
    });
  }

  async create(params: any): Promise<any> {
    return await this.prisma.realEstateAgentComments.create(params);
  }

  async findOne(params: any): Promise<any> {
    return await this.prisma.realEstateAgentComments.findFirst(params);
  }

  async findOneByID(id: number): Promise<any> {
    return await this.prisma.realEstateAgentComments.findUnique({
      where: { id },
    });
  }

  async findMany(
    params: any,
    relations?: string[],
    pagination?: IPagination
  ): Promise<any[]> {
    return await this.prisma.realEstateAgentComments.findMany(params);
  }

  async updateOne(where: any, updateData: any): Promise<any> {
    return await this.prisma.realEstateAgentComments.update({
      where,
      data: updateData,
    });
  }

  async updateMany(
    where: Partial<any>,
    updateData: Partial<any>
  ): Promise<any> {
    return await this.prisma.realEstateAgentComments.updateMany({
      where,
      data: updateData,
    });
  }

  async deleteOne(where: any): Promise<any> {
    return await this.prisma.realEstateAgentComments.delete({ where });
  }

  async deleteMany(where: any): Promise<any> {
    return await this.prisma.realEstateAgentComments.deleteMany({ where });
  }
}
