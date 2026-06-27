import { Injectable } from "@nestjs/common";
import { UpdateProvinceDto } from "./dto/update-province.dto";
import { PrismaService } from "../../../../prisma/prisma.service";

@Injectable()
export class ProvincesService {
  constructor(private prisma: PrismaService) {}

  create() {
    return "This action adds a new province";
  }

  async findAll() {
    try {
      return await this.prisma.provinces.findMany({
        select: {
          id: true,
          name: true,
          cities: { select: { id: true, name: true }, orderBy: { id: "asc" } },
        },
        orderBy: { id: "asc" },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async findProvinces() {
    try {
      return await this.prisma.provinces.findMany({
        select: { id: true, name: true },
        orderBy: { id: "asc" },
      });
    } catch (error) {
      console.log(error);
    }
  }

  update(id: number, updateProvinceDto: UpdateProvinceDto) {
    return `This action updates a #${id} province`;
  }

  remove(id: number) {
    return `This action removes a #${id} province`;
  }
}
