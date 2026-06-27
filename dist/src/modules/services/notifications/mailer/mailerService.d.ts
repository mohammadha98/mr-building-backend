import IMailerBulk from "./contracts/IMailerBulk";
import IMailerMail from "./contracts/IMailerMail";
import IMailerService from "./contracts/IMailerService";
import MrBuildingMailerService from "./providers/MrBuildingMailerService";
export default class MailerService implements IMailerService {
    private readonly defaultProvider;
    constructor(defaultProvider: MrBuildingMailerService);
    send(body: IMailerMail): Promise<void>;
    sendBulk(body: IMailerBulk): Promise<void>;
}
