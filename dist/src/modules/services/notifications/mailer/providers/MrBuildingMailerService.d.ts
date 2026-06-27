import IMailerBulk from "../contracts/IMailerBulk";
import IMailerMail from "../contracts/IMailerMail";
import IMailerService from "../contracts/IMailerService";
import { MailerService as MailerMain } from "@nestjs-modules/mailer";
export default class MrBuildingMailerService implements IMailerService {
    private readonly mailerService;
    constructor(mailerService: MailerMain);
    send(body: IMailerMail): Promise<void>;
    sendBulk(body: IMailerBulk): Promise<void>;
}
