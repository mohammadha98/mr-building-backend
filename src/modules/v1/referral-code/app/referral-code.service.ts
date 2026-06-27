import { Injectable } from "@nestjs/common";
import { CreateReferralCodeDto } from "./dto/create-referal-code.dto";
import { ClientService } from "src/modules/v1/client/app/client.service";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { randomBytes } from "crypto";
import { GetUsersReferralCodeDto } from "./dto/get-users-referal-code.dto";
import MissionTypes from "src/commons/contracts/MissionTypes";
import { getDetailsReferralCodeDto } from "./dto/getDetails.dto";
import UserTypes from "src/commons/contracts/UserTypes";
import { ReferralCodes } from "@prisma/client";

@Injectable()
export class ReferralCodeService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly clientService: ClientService
  ) {}

  async create(body: CreateReferralCodeDto) {
    try {
      const client = await this.clientService.validateWithID(
        Number(body.client_id)
      );
      if (!client) {
        return { status: 403 };
      }

      const validateReferralCode =
        await this.prismaService.referralCodes.findFirst({
          where: { code: body.code },
        });

      if (!validateReferralCode) {
        return { status: 400 };
      }

      const history = await this.prismaService.referralHistorry.findFirst({
        where: {
          client_id: body.client_id,
        },
        select: {
          client: { select: { name: true, surname: true } },
        },
      });

      if (!history) {
        if (validateReferralCode.owner_id !== client.id) {
          const referralCodeOwner = await this.prismaService.client.findFirst({
            where: { id: validateReferralCode.owner_id },
          });

          // save referral mission for new user
          const missionReferral = await this.prismaService.missions.findFirst({
            where: { key: MissionTypes.referral_code },
          });

          await this.saveMissionForNewClient(
            validateReferralCode,
            missionReferral,
            client
          );

          await this.saveMissionForSubcategoryRegistration(
            referralCodeOwner,
            missionReferral
          );

          return {
            status: 201,
            message: `شما با موفقیت توسط ${
              referralCodeOwner.name + " " + referralCodeOwner.surname
            } دعوت شدید.`,
          };
        } else {
          return {
            status: 409,
          };
        }
      }

      const referralHistorry =
        await this.prismaService.referralHistorry.findFirst({
          where: { client_id: Number(body.client_id) },
          select: {
            referral: { select: { owner_id: true } },
          },
        });

      const referralCodeOwner = await this.prismaService.client.findFirst({
        where: { id: referralHistorry.referral.owner_id },
      });

      return {
        status: 200,
        message: `شما توسط ${
          referralCodeOwner.name + " " + referralCodeOwner.surname
        } دعوت شده اید.`,
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  // MissionTypes.referral_code
  private async saveMissionForNewClient(
    referralCode: any,
    missionReferral: any,
    client
  ) {
    await this.clientService.saveMission(missionReferral, client);

    await this.prismaService.referralHistorry.create({
      data: {
        referral: { connect: { id: referralCode.id } },
        client: { connect: { id: Number(client.id) } },
      },
    });
  }

  private async saveMissionForSubcategoryRegistration(client, mission) {
    const subcategory_registration =
      await this.prismaService.missions.findFirst({
        where: { key: MissionTypes.subcategory_registration },
      });

    await this.clientService.saveMission(subcategory_registration, client);
  }

  async getMyUser(query: GetUsersReferralCodeDto) {
    try {
      const client = await this.clientService.validateWithID(
        Number(query.client_id)
      );
      if (!client) {
        return { status: 403 };
      }

      const getUsers = await this.prismaService.referralCodes.findFirst({
        where: { owner_id: query.client_id },
        select: {
          referral_historry: {
            select: {
              client: {
                select: {
                  id: true,
                  name: true,
                  surname: true,
                  phone: true,
                  roles: true,
                },
              },
            },
            orderBy: { id: "desc" },
          },
        },
      });

      const clients = getUsers.referral_historry;
      const subSystemReferralCode = await this.getSubSystemReferralCode(
        clients
      );

      const missionReferralCode = await this.prismaService.missions.findFirst({
        where: { key: MissionTypes.referral_code },
      });

      return {
        status: 200,
        clients: subSystemReferralCode,
        score: missionReferralCode.point,
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  async getReferralDetails(query: getDetailsReferralCodeDto) {
    try {
      const client = await this.clientService.validateWithID(
        Number(query.client_id)
      );
      if (!client) {
        return { status: 403 };
      }

      const getUsers = await this.prismaService.referralHistorry.findMany({
        where: { referral_id: Number(query.referra_id) },
        select: {
          client: {
            select: { id: true, name: true, surname: true, roles: true },
          },
        },
      });

      const totalUsedMyReferralCode = this.getTotalUsedMyReferralCode(getUsers);
      const missionReferralCode = await this.prismaService.missions.findFirst({
        where: { key: MissionTypes.referral_code },
      });

      const totalPoint = await this.prismaService.receiveMissions.count({
        where: {
          mission_id: missionReferralCode.id,
          client_id: Number(query.client_id),
        },
      });

      return {
        status: 200,
        total: totalUsedMyReferralCode,
        point: missionReferralCode.point * totalPoint,
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  private async getSubSystemReferralCode(clients: any[]) {
    return await Promise.all(
      clients.map(async (item) => {
        const referralInfo = await this.prismaService.referralCodes.findFirst({
          where: { owner_id: Number(item.client.id) },
        });
        const number_of_sub_categories =
          await this.prismaService.referralHistorry.count({
            where: { referral_id: referralInfo.id },
          });
        return {
          client_id: item.client.id,
          client_name: item.client.name + " " + item.client.surname,
          client_phone: item.client.phone,
          client_roles: item.client.roles,
          referral_code: referralInfo.code,
          referral_id: referralInfo.id,
          number_of_sub_categories,
        };
      })
    );
  }

  private getTotalUsedMyReferralCode(clients: any[]) {
    const totalUsed = {
      clients: 0,
      estate_agent: 0,
      advisor: 0,
      admin: 0,
      operator_estate_agent: 0,
    };

    clients.map((item) => {
      if (item.client.roles.includes(UserTypes.estate_agent)) {
        totalUsed.estate_agent = totalUsed.estate_agent + 1;
      } else if (item.client.roles.includes(UserTypes.advisor)) {
        totalUsed.advisor = totalUsed.advisor + 1;
      } else if (item.client.roles.includes(UserTypes.admin)) {
        totalUsed.admin = totalUsed.admin + 1;
      } else {
        totalUsed.clients = totalUsed.clients + 1;
      }
    });
    return totalUsed;
  }

  public async getReferralCodeForClient(
    client_id: number
  ): Promise<ReferralCodes | boolean> {
    try {
      return await this.prismaService.referralCodes.findFirst({
        where: { owner_id: Number(client_id) },
      });
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  public async saveReferralCodeForCLient(client_id: number) {
    try {
      const validateClient = await this.getReferralCodeForClient(client_id);

      if (!validateClient) {
        const referralCode = await this.generateReferralCode();
        await this.prismaService.referralCodes.create({
          data: {
            code: referralCode,
            owner_id: Number(client_id),
          },
        });
        return referralCode;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async updateCodes() {
    try {
      const clientList = await this.prismaService.client.findMany({
        select: { id: true },
      });
      const clientListIds = clientList.map((item) => item.id);

      const existReferralCodes =
        await this.prismaService.referralCodes.findMany();
      const existReferralCodeOwnerIds = existReferralCodes.map(
        (item) => item.owner_id
      );

      const newClientIdsInReferralCodes = clientListIds.filter(
        (item) => !existReferralCodeOwnerIds.includes(item)
      );
      console.log("newClientIds");
      console.log(newClientIdsInReferralCodes.length);

      await Promise.all(
        newClientIdsInReferralCodes.map(async (client_id) => {
          const referralCode = await this.generateReferralCode();
          await this.prismaService.referralCodes.create({
            data: {
              owner_id: client_id,
              code: referralCode,
            },
          });
        })
      );
      return { status: 200 };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  private async generateReferralCode() {
    const newCode = randomBytes(8).toString("hex").toUpperCase();
    const validateCode = await this.prismaService.referralCodes.findFirst({
      where: { code: newCode },
    });
    if (validateCode) {
      this.generateReferralCode;
    }
    return newCode;
  }
}
