import { Injectable } from "@nestjs/common";
import IMessage from "./contracts/IMessage";
import IMessageProvider from "./contracts/IMessageProvider";
import SMSIR_Provider from "./providers/SMSIR_Provider";
import IBulkMessage from "./contracts/IBulkMessage";

@Injectable()
export default class SmsService {
  private readonly defaultProvider: IMessageProvider;
  constructor() {
    this.defaultProvider = new SMSIR_Provider();
  }

  public async send(message: IMessage) {
    await this.defaultProvider.send(message);
  }
  public async bulk(data: IBulkMessage) {
    await this.defaultProvider.bulk(data);
  }
}
