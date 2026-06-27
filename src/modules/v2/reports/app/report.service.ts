import { Injectable } from "@nestjs/common";
import { CreateReportBugDto } from "./dto/create-report-bugs.dto";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { CreateReportViolationDto } from "./dto/create-report-violation.dto";
import { ClientService } from "src/modules/v2/client/app/client.service";

@Injectable()
export class ReportsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly clientService: ClientService
  ) {}

  async storeBug(body: CreateReportBugDto) {
    try {
      const client = await this.prismaService.client.findUnique({
        where: { id: Number(body.client_id) },
      });
      if (!client) {
        return { status: 403 };
      }

      await this.prismaService.reportBugs.create({
        data: {
          client: { connect: { id: Number(body.client_id) } },
          content: body.content,
          type: body.type,
          source: body.source,
          image: body.image,
          voice: body.voice,
        },
      });

      const mission = await this.prismaService.missions.findFirst({
        where: { key: body.type },
      });
      if (mission) {
        await this.clientService.saveMission(mission, client);
      }

      return { status: 201 };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  async storeViolation(body: CreateReportViolationDto) {
    try {
      const client = await this.prismaService.client.findUnique({
        where: { id: Number(body.client_id) },
      });
      if (!client) {
        return { status: 403 };
      }

      await this.prismaService.reportViolations.create({
        data: {
          client: { connect: { id: Number(body.client_id) } },
          description: body.description,
          item_id: body.item_id,
          type: body.type,
        },
      });

      return { status: 201 };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }
}
