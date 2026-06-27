import { Injectable } from "@nestjs/common";
import { CreateBinstaDto } from "./dto/create-binsta.dto";
import { UpdateBinstaDto } from "./dto/update-binsta.dto";
import { ValidateUsernameBinstaDto } from "./dto/validate-username.dto";
import { PrismaService } from "../../../../prisma/prisma.service";
import { ClientService } from "src/modules/v2//client/app/client.service";

@Injectable()
export class BinstaService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly clientService: ClientService
  ) {}

  async validateUsername(body: ValidateUsernameBinstaDto) {
    try {
      const validateClient = await this.clientService.validateWithID(
        body.client_id
      );

      if (!validateClient) {
        return { status: 403 };
      }

      const validateBinstaUsername =
        await this.prismaService.binstaAccounts.findFirst({
          where: { username: body.username },
        });

      if (!validateBinstaUsername) {
        return { status: 200 };
      }

      return { status: 409 };
    } catch (error) {
      return { status: 500 };
    }
  }

  create(createBinstaDto: CreateBinstaDto) {
    return "This action adds a new binsta";
  }

  findAll() {
    return `This action returns all binsta`;
  }

  findOne(id: number) {
    return `This action returns a #${id} binsta`;
  }

  update(id: number, updateBinstaDto: UpdateBinstaDto) {
    return `This action updates a #${id} binsta`;
  }

  remove(id: number) {
    return `This action removes a #${id} binsta`;
  }
}
