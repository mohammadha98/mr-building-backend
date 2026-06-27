import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { UpdateClientDto } from "./dto/update-client.dto";
import { DisableUpdateStatus } from "./dto/disbale-update-status";
import { SaveGifClientDto } from "./dto/save-gif-client.dto";
import { VerifyAuthDto } from "src/modules/v2//auth/dto/verify-auth.dto";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import IMetadata from "src/commons/contracts/IMetadata";
import IPagination from "src/commons/contracts/IPagination";
import InstalledVersionTypes from "src/commons/contracts/InstalledVersionTypes";
import { UpdateClienProfiletDto } from "./dto/update-profile.dto";
import { Client, DailyMissionsLogs, Missions } from "@prisma/client";
import EventService from "../../webinar/provider/EventService";
import UploadService from "src/modules/services/UploadService";

@Injectable()
export class ClientService {
  private eventService: EventService;
  private uploadService: UploadService;

  constructor(private prisma: PrismaService) {
    this.eventService = new EventService();
    this.uploadService = new UploadService();
  }

  async create(verifyAuthDto: VerifyAuthDto) {
    try {
      return await this.prisma.client.create({
        data: {
          phone: verifyAuthDto.phone,
          key: verifyAuthDto.key,
          password: null,
        },
        select: {
          id: true,
          webinar_provider_id: true,
          name: true,
          surname: true,
          phone: true,
          username: true,
          email: true,
          has_update_direct: true,
          avatar: true,
          score: true,
          token: true,
          key: true,
          province: { select: { id: true, name: true } },
          city: { select: { id: true, name: true } },
        },
      });
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  private async saveReceivedMission(mission: Missions, client: Client) {
    await this.prisma.receiveMissions.create({
      data: {
        client_id: client.id,
        mission_id: mission.id,
        point: mission.point,
        title: mission.title,
        description: mission.description,
        received_at: new Date(),
      },
    });
  }

  async saveMission(mission: Missions, client: Client) {
    try {
      if (!mission.is_limited) {
        await this.saveReceivedMission(mission, client);
        await this.saveHistoryOfScore(
          client.id,
          mission,
          client.score,
          "increase"
        );
      } else {
        const dailyMission = await this.prisma.dailyMissionsLogs.findFirst({
          where: { clientID: client.id, missionType: mission.key },
        });

        if (!dailyMission) {
          console.log(" --- Save Daily Mission: NEW ---");
          await this.handleDailyLogin(dailyMission, mission, client);
        } else {
          console.log(" --- Save Daily Mission: EXIST ---");
          await this.saveMissionDailyLogin(mission, dailyMission, client);
        }
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  public async saveMissionDailyLogin(
    dailyMissionInfo: Missions,
    dailyMissionsLogs: DailyMissionsLogs,
    client: Client
  ) {
    const calculateTimeDifference = this.calculateTimeDifference(
      dailyMissionInfo.number_of_hours,
      dailyMissionsLogs.usedAt
    );

    console.log({ calculateTimeDifference });

    if (calculateTimeDifference) {
      console.log("saveMissionDailyLogin");
      await this.handleDailyLogin(dailyMissionsLogs, dailyMissionInfo, client);
    }
  }

  private async handleDailyLogin(
    dailyMission: DailyMissionsLogs,
    mission: Missions,
    client: Client
  ) {
    const loginDate = new Date();

    if (!dailyMission) {
      await this.prisma.dailyMissionsLogs.create({
        data: {
          clientID: client.id,
          missionType: mission.key,
          usedAt: loginDate.toISOString(),
        },
      });
    } else {
      await this.prisma.dailyMissionsLogs.update({
        where: {
          id: dailyMission.id,
        },
        data: {
          usedAt: loginDate.toISOString(),
        },
      });
    }

    await this.saveReceivedMission(mission, client);
    await this.saveHistoryOfScore(client.id, mission, client.score, "increase");
  }

  calculateTimeDifference(number_of_hours: number, usedAt: Date) {
    const DAY = 1000 * 60 * 60 * number_of_hours;
    const expirationTime = Number(usedAt) + DAY;
    const currentTime = Number(new Date());

    return currentTime > expirationTime;
  }

  async saveHistoryOfScore(
    client_id: number,
    mission: Missions,
    latestScore: number,
    action: string
  ) {
    try {
      const newScore = Number(latestScore) + Number(mission.point);
      console.log("saveHistoryOfScore");

      console.log({ latestScore });
      console.log({ newScore });

      await this.prisma.historyOfScores.create({
        data: {
          client: { connect: { id: Number(client_id) } },
          title: mission.title,
          score: Number(mission.point),
          type: mission.key,
          action,
        },
      });
      await this.prisma.client.update({
        where: { id: Number(client_id) },
        data: {
          score: newScore,
          last_login_time: new Date(Date.now()),
        },
      });
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async findOne(phone: string) {
    return await this.prisma.client.findFirst({
      where: { phone },
    });
  }

  async clientInfo(id: number) {
    try {
      const client_info = (await this.prisma.client.findUnique({
        where: { id },
        select: {
          id: true,
          webinar_provider_id: true,
          name: true,
          surname: true,
          phone: true,
          username: true,
          email: true,
          has_update_direct: true,
          avatar: true,
          token: true,
          key: true,
          province: { select: { id: true, name: true } },
          city: { select: { id: true, name: true } },
        },
      })) as any;
      if (!client_info) {
        return { status: 403 };
      }

      const referral_code = await this.prisma.referralCodes.findFirst({
        where: { owner_id: id },
      });
      client_info.referralCode = referral_code.code;

      return {
        status: 200,
        client_info,
      };
    } catch (error) {
      // TODO: log for client info
      console.log("*** Error in Get Client Ino ***");
      console.log(error);
      return { status: 500 };
    }
  }

  async update(updateClientDto: UpdateClientDto) {
    try {
      const client = await this.prisma.client.findUnique({
        where: {
          id: updateClientDto.id,
        },
      });

      const username = client.phone;
      const email = `${client.phone}@psgpsg.com`;
      const password = `${username}#${this.generateCode(1111, 999)}`;
      let webinar_provider_id = null;

      // register new user in alocom webinar provider
      const name = updateClientDto.name;
      const surname = updateClientDto.surname;

      const webinarInfo = (await this.eventService.registerUser({
        name,
        surname,
        email: email,
        username,
        cellphone: client.phone,
        password,
        status: 1,
      })) as any;
      if (webinarInfo.data.data.id) {
        webinar_provider_id = webinarInfo.data.data.id;
        // update webinar_provider_id & name for client
        let data: any = {};
        if (updateClientDto.province && updateClientDto.city) {
          data = {
            webinar_provider_id,
            name: updateClientDto.name,
            surname: updateClientDto.surname,
            username,
            password,
            province: { connect: { id: Number(updateClientDto.province) } },
            city: { connect: { id: Number(updateClientDto.city) } },
          };
        } else {
          data = {
            webinar_provider_id,
            name: updateClientDto.name,
            surname: updateClientDto.surname,
            username,
            password,
          };
        }
        const updatedClient = await this.prisma.client.update({
          where: { id: client.id },
          data: data,
          select: {
            id: true,
            name: true,
            surname: true,
            username: true,
            email: true,
            has_update_direct: true,
            avatar: true,
            token: true,
            webinar_provider_id: true,
            phone: true,
            key: true,
            province: { select: { id: true, name: true } },
            city: { select: { id: true, name: true } },
          },
        });

        return { status: 200, client: updatedClient };
      }
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  async updateClienProfile(body: UpdateClienProfiletDto) {
    try {
      const client = await this.prisma.client.findUnique({
        where: {
          id: body.client_id,
        },
      });

      if (!client) {
        return { status: 403 };
      }

      if (!body.avatar) {
        body.avatar = client.avatar;
      }

      const result = (await this.prisma.client.update({
        where: { id: body.client_id },
        data: {
          name: body.name,
          surname: body.surname,
          avatar: body.avatar,
        },
        select: {
          id: true,
          webinar_provider_id: true,
          name: true,
          surname: true,
          avatar: true,
          phone: true,
          username: true,
          email: true,
          key: true,
          token: true,
          province: { select: { id: true, name: true } },
          city: { select: { id: true, name: true } },
        },
      })) as any;
      const referral_code = await this.prisma.referralCodes.findFirst({
        where: { owner_id: body.client_id },
      });
      result.referralCode = referral_code.code;
      return { client: result };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  async saveGif(body: SaveGifClientDto) {
    try {
      const client = await this.prisma.client.findUnique({
        where: {
          id: body.client_id,
        },
      });

      await this.uploadService.moveFile(
        body.file,
        "temp/gif",
        `clients/${client.key}/gif/`
      );

      const result = await this.prisma.clientGifs.create({
        data: {
          client: { connect: { id: Number(body.client_id) } },
          file: body.file,
          key: client.key,
        },
      });

      return { status: 201, result };
    } catch (error) {
      return { status: 500 };
    }
  }

  async getClientGifList(query: PaginationDto) {
    try {
      const client = await this.prisma.client.findUnique({
        where: {
          id: query.user_id,
        },
      });

      if (!client) {
        return { status: 403 };
      }

      const count = await this.prisma.clientGifs.count({
        where: {
          client_id: query.user_id,
        },
      });

      const total = this.getTotalPageNumber(
        Number(count),
        Number(query.per_page)
      );

      const paginationValue = this.makePagination(
        Number(query.page),
        Number(query.per_page)
      );

      const result = await this.prisma.clientGifs.findMany({
        where: {
          client_id: query.user_id,
        },
        skip: paginationValue.offset,
        take: paginationValue.per_page,
        orderBy: { id: "desc" },
      });

      return {
        status: 201,
        result,
        metadata: this.makeMetadata(
          Number(query.page),
          Number(query.per_page),
          Number(total)
        ),
      };
    } catch (error) {
      return { status: 500 };
    }
  }

  async activateUpdates(installed_version_type: string) {
    try {
      let data = {};
      if (installed_version_type === InstalledVersionTypes.direct) {
        data = {
          has_update_direct: true,
        };
      } else if (installed_version_type === InstalledVersionTypes.cafebazar) {
        data = {
          has_update_cafebazar: true,
        };
      } else if (installed_version_type === InstalledVersionTypes.myket) {
        data = {
          has_update_myket: true,
        };
      } else if (installed_version_type === InstalledVersionTypes.google_play) {
        data = {
          has_update_google_play: true,
        };
      }
      await this.prisma.client.updateMany({
        data: data,
      });
    } catch (error) {
      return false;
    }
  }

  async disableUpdateStatus(query: DisableUpdateStatus) {
    try {
      // increase total_installs
      const itemInfo = await this.prisma.forceUpdate.findUnique({
        where: { id: Number(query.item_id) },
      });
      const data: any = {
        installed_version: itemInfo.version,
      };

      query.installed_version_type = itemInfo.installed_version_type;

      if (!query.installed_version_type) {
        data.has_update_direct = false;
      }
      if (query.installed_version_type === InstalledVersionTypes.direct) {
        data.has_update_direct = false;
      }
      if (query.installed_version_type === InstalledVersionTypes.cafebazar) {
        data.has_update_cafebazar = false;
      }
      if (query.installed_version_type === InstalledVersionTypes.myket) {
        data.has_update_myket = false;
      }

      console.log(query.client_id);
      console.log(data);

      await this.prisma.client.updateMany({
        where: { id: Number(query.client_id) },
        data: data,
      });

      await this.prisma.forceUpdate.update({
        where: { id: Number(query.item_id) },
        data: { total_installs: Number(itemInfo.total_installs) + 1 },
      });
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async addRole(client_id: number, role: string) {
    await this.prisma.client.update({
      where: { id: client_id },
      data: { roles: { push: [role] } },
    });
  }

  async removeRole(client_id: number, role: string) {
    const clientInfo = (await this.validateWithID(client_id)) as any;
    const roles: string[] = clientInfo.roles;

    if (roles.includes(role)) {
      roles.splice(roles.indexOf(role), 1);
    }

    await this.prisma.client.update({
      where: { id: client_id },
      data: { roles },
    });
  }

  async updateToken(id: number, token: string) {
    return await this.prisma.client.update({
      where: {
        id: id,
      },
      data: {
        token: token,
      },
    });
  }

  // send username and password for client with sms
  private generateCode(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  public async validateWithID(client_id: number) {
    const client = await this.prisma.client.findUnique({
      where: { id: client_id },
    });
    if (!client) {
      return false;
    }
    return client;
  }

  public async deCreaseScore(client_id: number, point: number) {
    const clientInfo = await this.validateWithID(client_id);
    if (clientInfo && clientInfo.score >= Number(point)) {
      await this.prisma.client.update({
        where: { id: client_id },
        data: { score: clientInfo.score - Number(point) },
      });
      return clientInfo.score - Number(point);
    }
    return false;
  }

  public async inCreaseScore(client_id: number, point: number) {
    const clientInfo = await this.validateWithID(client_id);
    if (clientInfo) {
      await this.prisma.client.update({
        where: { id: client_id },
        data: { score: clientInfo.score + Number(point) },
      });
      return clientInfo.score + Number(point);
    }
    return false;
  }

  // make metadata
  private makeMetadata(
    page: number,
    per_page: number,
    total_page: number
  ): IMetadata {
    return {
      page,
      total_page,
      per_page: per_page,
      next: page < total_page,
      back: page > 1,
    };
  }

  // make metadata
  private makePagination(page: number, per_page: number): IPagination {
    return {
      offset: (page - 1) * per_page,
      per_page,
    };
  }

  private getTotalPageNumber(total_number: number, per_page: number) {
    return Math.ceil(total_number / per_page);
  }
}
