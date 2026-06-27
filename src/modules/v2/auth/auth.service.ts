import { HttpStatus, Injectable } from "@nestjs/common";
import { VerifyAuthDto } from "./dto/verify-auth.dto";
import { PrismaService } from "../../../../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { ClientService } from "src/modules/v2//client/app/client.service";
import SmsTemplates from "src/commons/contracts/Templates";
import AppSteps from "src/commons/contracts/AppSteps";
import { randomBytes } from "crypto";
import MissionTypes from "src/commons/contracts/MissionTypes";
import { ReferralCodeService } from "src/modules/v2/referral-code/app/referral-code.service";
import { Client } from "@prisma/client";
import missionTypes from "src/commons/contracts/MissionTypes";
import { MessengerChannelsService } from "../messenger_channels/app/messenger-channels.service";
import SmsService from "src/modules/services/notifications/sms/SmsService";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private smsService: SmsService,
    private jwtService: JwtService,
    private clientService: ClientService,
    private referralCodeService: ReferralCodeService,
    private readonly messengerChannelsService: MessengerChannelsService
  ) {}

  async create(phone: string, code: number) {
    try {
      const now = new Date(Date.now());
      const expiresAt = new Date(Date.now());
      expiresAt.setTime(now.getTime() + 5 * 60000);

      const client = await this.prisma.registeredModel.findFirst({
        where: {
          phone,
        },
      });

      if (!client) {
        await this.prisma.registeredModel.create({
          data: {
            phone,
            code,
            expires_at: expiresAt,
          },
        });
      } else {
        await this.prisma.registeredModel.updateMany({
          where: {
            phone: phone,
          },
          data: {
            code,
            expires_at: expiresAt,
          },
        });
      }

      // send verify code
      await this.smsService.send({
        message: String(code),
        templateID: Number(SmsTemplates.login_test),
        recipient: phone,
        parameterKey: "code",
      });
      return client;
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(VerifyAuthDto: VerifyAuthDto) {
    return await this.prisma.registeredModel.findFirst({
      where: {
        phone: VerifyAuthDto.phone,
        code: Number(VerifyAuthDto.code),
      },
    });
  }

  async verify(VerifyAuthDto: VerifyAuthDto) {
    try {
      const result = await this.findOne(VerifyAuthDto);

      console.log("*** verify ***");
      if (!result) {
        return { status: 400 };
      }

      // get client info
      let client: any = await this.prisma.client.findFirst({
        where: { phone: VerifyAuthDto.phone },
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
      });

      let status = HttpStatus.OK;
      let message = null;
      let next_step = AppSteps.home;

      if (!client) {
        next_step = AppSteps.complete_registration;
        VerifyAuthDto.key = await this.generateKey();

        client = await this.clientService.create(VerifyAuthDto);

        // generate jwt token
        client.token = this.jwtService.sign({ sub: client.id });

        // update client token
        await this.clientService.updateToken(Number(client.id), client.token);

        await this.saveMissionForNewClient(client);

        // generate referral code
        client.referralCode =
          await this.referralCodeService.saveReferralCodeForCLient(client.id);

        status = HttpStatus.CREATED;
        message = "ثبت نام با موفقیت انجام شد.";

        // عضویت در کانال رسمی آقای ساختماندر مسنجر
        const channelInfo = await this.messengerChannelsService.channelInfo({
          username: "mrbuilding",
          client_id: client.id,
        });
        if (channelInfo.channels.length) {
          await this.messengerChannelsService.joinChannel({
            channel_id: channelInfo.channels[0].id,
            client_id: client.id,
          });
        }
      } else {
        next_step = client.webinar_provider_id
          ? AppSteps.home
          : AppSteps.complete_registration;
        message = "کد ارسالی تایید شد. با موفقیت وارد شدید.";

        const referral =
          (await this.referralCodeService.getReferralCodeForClient(
            client.id
          )) as any;
        if (referral) {
          client.referralCode = referral.code;
        } else {
          client.referralCode = "";
        }
      }

      await this.delete(VerifyAuthDto.phone);
      return { status, message, client, next_step };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  // عضویت در کانال رسمی آقای ساختماندر مسنجر
  public async addAllUserToDefaultChannel() {
    const clients = await this.prisma.client.findMany({});

    const channelInfo = await this.messengerChannelsService.channelInfo({
      username: "mrbuilding",
      client_id: 1,
    });

    if (channelInfo.status === 200) {
      clients.map(async (item) => {
        await this.messengerChannelsService.joinChannel({
          channel_id: channelInfo.channels[0].id,
          client_id: item.id,
        });
      });
    }
  }

  private async saveMissionForNewClient(client: Client) {
    // create register mission for new user
    let registerMission = (await this.prisma.missions.findFirst({
      where: { key: MissionTypes.register },
    })) as any;

    if (!registerMission) {
      registerMission = {
        id: 1,
        key: missionTypes.register,
        title: "ثبت ‌نام و ورود به اپلیکیشن",
        description: "با اولین ورود به اپلیکیشن به‌صورت خودکار امتیاز می‌گیرید",
        point: 130,
        type: MissionTypes.register,
      };
    }

    await this.clientService.saveMission(registerMission, client);
  }

  private async generateKey() {
    const key = randomBytes(12).toString("hex").toUpperCase();
    const isDuplicateChatId = await this.prisma.client.findFirst({
      where: { key },
    });
    if (isDuplicateChatId) {
      await this.generateKey();
    }
    return key;
  }

  private async generateReferralCode() {
    const newCode = randomBytes(6).toString("hex").toUpperCase();
    const validateCode = await this.prisma.referralCodes.findFirst({
      where: { code: newCode },
    });
    if (validateCode) {
      this.generateReferralCode;
    }
    return newCode;
  }

  async delete(phone: string) {
    await this.prisma.registeredModel.deleteMany({
      where: {
        phone,
      },
    });
  }
}
