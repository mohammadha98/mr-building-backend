import { Injectable } from "@nestjs/common";
import { CreateValidateClientDto } from "./dto/create-validate-client.dto";
import { PrismaService } from "../../../../prisma/prisma.service";
import { VerifyCodeValidateClientDto } from "./dto/verify-validate-client.dto";
import UserTypes from "src/commons/contracts/UserTypes";
import SmsService from "src/modules/services/notifications/sms/SmsService";
import SmsTemplates from "src/commons/contracts/Templates";

@Injectable()
export class ValidateClientsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly smsService: SmsService
  ) {}
  async create(body: CreateValidateClientDto) {
    try {
      const client = await this.prismaService.client.findFirst({
        where: { id: Number(body.client_id) },
      });
      if (!client) {
        return { status: 403 };
      }
      await this.prismaService.validateClient.deleteMany({
        where: {
          type: body.type,
          phone: body.phone,
          owner_id: Number(body.client_id),
        },
      });
      await this.prismaService.validateClient.create({
        data: {
          code: body.code,
          type: body.type,
          phone: body.phone,
          owner_id: Number(body.client_id),
        },
      });
      // send verify code
      await this.smsService.send({
        message: String(body.code),
        templateID: Number(SmsTemplates.validate_client_phone),
        recipient: body.phone,
        parameterKey: "code",
      });
      return { status: 200 };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  async VerifyValidatePhone(body: VerifyCodeValidateClientDto) {
    try {
      const client = await this.prismaService.client.findFirst({
        where: { id: Number(body.client_id) },
      });
      if (!client) {
        return { status: 403 };
      }
      const result = await this.prismaService.validateClient.findFirst({
        where: {
          type: body.type,
          phone: body.phone,
          code: Number(body.code),
        },
      });
      if (!result) {
        return { status: 400 };
      }

      if (result.type === UserTypes.estate_agent) {
        await this.prismaService.realEstateAgents.updateMany({
          where: { client_id: Number(result.owner_id) },
          data: { phone: result.phone, validate_phone: true },
        });
      } else if (result.type === UserTypes.advisor) {
        await this.prismaService.realEstateAdvisors.updateMany({
          where: { client_id: Number(result.owner_id) },
          data: { phone: result.phone, validate_phone: true },
        });
      }

      await this.prismaService.validateClient.deleteMany({
        where: {
          type: result.type,
          phone: result.phone,
          owner_id: Number(result.owner_id),
        },
      });

      return { status: 201 };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }
}
