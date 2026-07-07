import { PrismaService } from "../../../../../prisma/prisma.service";
import MarketplaceMessengerTransformer from "./Transformer";
import { SendMessageInMarketplaceWs } from "../../ws-server/dto/marketplace/send-message-in-marketplace-ws.dto";
import UploadService from "src/modules/services/UploadService";
import { SeenMessageMarketplaceWsDto } from "../../ws-server/dto/marketplace/seen-message-marketplace-ws.dto";
export declare class MarketplaceMessenger_MessageSection {
    private readonly prismaService;
    private readonly messageTransformer;
    private readonly uploadService;
    private messageSelector;
    private chatSelector;
    constructor(prismaService: PrismaService, messageTransformer: MarketplaceMessengerTransformer, uploadService: UploadService);
    private getChatInfoByKey;
    private presentedChat;
    private getLastMessage;
    private storefrontInfoByClientId;
    private starterInfo;
    private getClientInfo;
    private getMessageInfoById;
    saveMessage(body: SendMessageInMarketplaceWs): Promise<{
        id: any;
        key: any;
        type: any;
        notification: any;
        action_type: any;
        message_type: any;
        number_of_unread_messages: any;
        starter_info: {
            id: any;
            name: string;
            phone: any;
            avatar: string;
        };
        participant_info: {
            id: any;
            name: string;
            phone: any;
            avatar: string;
        };
        last_message: any;
        last_message_time: {
            day: number;
            month: string;
            year: number;
            time: string;
        };
        message_time: any;
    }>;
    deleteMessage({ message_ids, type, room, client_id, isOnline }: any): Promise<{
        last_message: any;
        deleted_messages: any[];
    }>;
    seenMessages(body: SeenMessageMarketplaceWsDto): Promise<void>;
}
