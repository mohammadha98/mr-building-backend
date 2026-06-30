import IMailerBulk from "../contracts/IMailerBulk";
import IMailerMail from "../contracts/IMailerMail";
import IMailerService from "../contracts/IMailerService";
import { MailerService as MailerMain } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class MrBuildingMailerService implements IMailerService {
  constructor(private readonly mailerService: MailerMain) {}

  async send(body: IMailerMail): Promise<void> {
    try {
      const attachments = [];
      await this.mailerService
        .sendMail({
          to: body.to,
          text: body.body,
          subject: body.subject,
          html: body.body,
          attachments,
          from:
            process.env.MAIL_FROM ||
            process.env.MAIL_USER ||
            process.env.MAIL_USERNAME,
        })
        .then((response) => {
          console.log("Email sent");
          console.log(response);
        })
        .catch((e) => {
          console.log("Error sending email", e);
        });
    } catch (e) {
      console.log("Error sending email");
      console.log(e);
    }
  }

  async sendBulk(body: IMailerBulk): Promise<void> {
    await body.to.map((email) => {
      console.log({ email });
      this.send({
        body: body.body,
        to: email,
        subject: body.subject,
      });
    });
  }
}
