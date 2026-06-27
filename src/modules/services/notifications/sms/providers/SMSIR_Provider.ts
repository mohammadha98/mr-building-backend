import IMessageProvider from "../contracts/IMessageProvider";
import IMessage from "../contracts/IMessage";
import { Smsir } from "sms-typescript/lib";
import IBulkMessage from "../contracts/IBulkMessage";

export default class SMSIR_Provider implements IMessageProvider {
  private token =
    "JJ8IfeMbjvF4sbLJjNL44Hx6zerka6ffZZd4DsmzGT06bScOeDqhDKeEdEMennrZ";
  private lineNumber = 30007732011470;
  private smsWebService: Smsir;

  constructor() {
    this.smsWebService = new Smsir(this.token, this.lineNumber);
  }

  public async send(message: IMessage): Promise<void> {
    try {
      const credit = (await this.getCredit()) as any;

      if (credit?.status == 1) {
        await this.smsWebService.SendVerifyCode(
          String(message.recipient),
          Number(message.templateID),
          [{ name: message.parameterKey, value: String(message.message) }]
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  public async bulk(data: IBulkMessage): Promise<void> {
    const credit = (await this.getCredit()) as any;

    if (credit?.status == 1) {
      try {
        console.log(data.mobiles);
        const result = await this.smsWebService.SendBulk(
          data.messageText,
          data.mobiles,
          null,
          this.lineNumber
        );
        console.log(result.data);
      } catch (error) {
        console.log(error);
      }
    }
  }

  // get provider credit
  private async getCredit(): Promise<void> {
    const credit = await this.smsWebService.getCredit();
    return credit.data;
  }
}
