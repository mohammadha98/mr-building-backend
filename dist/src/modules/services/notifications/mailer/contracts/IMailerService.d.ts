import IMailerMail from "./IMailerMail";
import IMailerBulk from "./IMailerBulk";
interface IMailerService {
    send(body: IMailerMail): Promise<void>;
    sendBulk(body: IMailerBulk): Promise<void>;
}
export default IMailerService;
