import IMessageProvider from "../contracts/IMessageProvider";
import IMessage from "../contracts/IMessage";
import IBulkMessage from "../contracts/IBulkMessage";
export default class SMSIR_Provider implements IMessageProvider {
    private token;
    private lineNumber;
    private smsWebService;
    constructor();
    send(message: IMessage): Promise<void>;
    bulk(data: IBulkMessage): Promise<void>;
    private getCredit;
}
