import { MessengerSaveMessageService } from "./save-message.service";
import { GetMessagesDto } from "./dto/get-messages.dto";
export declare class MessengerSaveMessageController {
    private readonly saveMessageService;
    constructor(saveMessageService: MessengerSaveMessageService);
    findMessages(query: GetMessagesDto): Promise<{
        statusCode: number;
        data: {
            data: any[];
            metadata: import("../../../../commons/contracts/IMetadata").default;
        };
        status?: undefined;
    } | {
        status: number;
        statusCode?: undefined;
        data?: undefined;
    }>;
}
