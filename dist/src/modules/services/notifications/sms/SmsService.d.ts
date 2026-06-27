import IMessage from "./contracts/IMessage";
import IBulkMessage from "./contracts/IBulkMessage";
export default class SmsService {
    private readonly defaultProvider;
    constructor();
    send(message: IMessage): Promise<void>;
    bulk(data: IBulkMessage): Promise<void>;
}
