import IBulkMessage from "./IBulkMessage";
import IMessage from "./IMessage";

export default interface IMessageProvider {
  send(message: IMessage): Promise<void>;
  bulk(data: IBulkMessage): Promise<void>;
}
