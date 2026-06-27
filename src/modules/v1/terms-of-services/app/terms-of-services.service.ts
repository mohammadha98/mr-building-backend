import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../../prisma/prisma.service";

@Injectable()
export class TermsOfServicesService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    try {
      const result = await this.prismaService.termsOfServices.findFirst({
        where: { key: "terms_of_use" },
      });
      return { status: 200, result };
    } catch (error) {
      return { status: 500 };
    }
  }
}
