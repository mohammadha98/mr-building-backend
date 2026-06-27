import IMailerBulk from "./contracts/IMailerBulk";
import IMailerMail from "./contracts/IMailerMail";
import IMailerService from "./contracts/IMailerService";
import { Injectable } from "@nestjs/common";
import MrBuildingMailerService from "./providers/MrBuildingMailerService";

@Injectable()
export default class MailerService implements IMailerService {
  constructor(private readonly defaultProvider: MrBuildingMailerService) {}

  async send(body: IMailerMail): Promise<void> {
    await this.defaultProvider.send(body);
  }

  async sendBulk(body: IMailerBulk): Promise<void> {
    await this.defaultProvider.sendBulk(body);
  }
}
