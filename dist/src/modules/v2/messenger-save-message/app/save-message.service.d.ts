import { PrismaService } from "../../../../../prisma/prisma.service";
import IMetadata from "src/commons/contracts/IMetadata";
import { GetMessagesDto } from "./dto/get-messages.dto";
import MessengerSaveMessageTransformer from "./Transformer";
import UploadService from "src/modules/services/UploadService";
import { ForwardMessageInSaveMessage } from "../../ws-server/dto/messenger/channel/send-message-rmessenger-ws-server.dto";
export declare class MessengerSaveMessageService {
    private readonly prismaService;
    private readonly saveMessageTransformer;
    private readonly uploadService;
    constructor(prismaService: PrismaService, saveMessageTransformer: MessengerSaveMessageTransformer, uploadService: UploadService);
    storeSaveMessage(client_id: number): Promise<{
        id: number;
        key: string;
        created_at: Date;
        client_id: number;
        last_message_time: Date;
        messages: {
            id: number;
            reaction: string;
            key: string;
            content: string;
            caption: string;
            size: number;
            length: number;
            thumbnail: string;
            created_at: Date;
            is_edited: boolean;
            is_replied: boolean;
            have_reaction: boolean;
            type: string;
            is_forwarded: boolean;
            action_type: string;
            forward_from: string;
            forward_from_client_id: number;
            forward_message_id: number;
            forward_from_channel: {
                id: number;
                key: string;
                username: string;
                title: string;
                avatar: string;
            };
            forward_from_client: {
                id: number;
                key: string;
                name: string;
                surname: string;
                avatar: string;
                phone: string;
            };
            replied_by: {
                id: number;
                reaction: string;
                key: string;
                content: string;
                caption: string;
                size: number;
                length: number;
                created_at: Date;
                is_edited: boolean;
                is_replied: boolean;
                have_reaction: boolean;
                type: string;
            }[];
        }[];
    }>;
    saveNewMessage(body: any): Promise<{
        id: any;
        key: any;
        message_type: string;
        created_at: any;
        last_message: any;
        last_message_time: {
            day: number;
            month: string;
            year: number;
            time: string;
        };
        message_time: any;
    }>;
    private copyFileForForward;
    forwardMessage(messageBody: ForwardMessageInSaveMessage): Promise<any>;
    deleteMessage({ room, message_ids }: any): Promise<{
        last_message: import("@prisma/client/runtime").GetResult<{
            id: number;
            key: string;
            type: string;
            content: string;
            caption: string;
            size: number;
            length: number;
            thumbnail: string;
            is_replied: boolean;
            is_edited: boolean;
            action_type: string;
            is_forwarded: boolean;
            forward_from: string;
            forward_message_id: number;
            have_reaction: boolean;
            reaction: string;
            save_message_id: number;
            forward_from_client_id: number;
            forward_from_channel_id: number;
            created_at: Date;
            reply_to_id: number;
        }, unknown, never> & {};
        deleted_messages: any[];
    }>;
    getSaveMessage(client_id: number): Promise<{
        id: any;
        key: any;
        message_type: string;
        created_at: any;
        last_message: any;
        last_message_time: {
            day: number;
            month: string;
            year: number;
            time: string;
        };
        message_time: any;
    }>;
    private presentedMessage;
    private prepaireMessage;
    findMessages(query: GetMessagesDto): Promise<{
        statusCode: number;
        data: {
            data: any[];
            metadata: IMetadata;
        };
        status?: undefined;
    } | {
        status: number;
        statusCode?: undefined;
        data?: undefined;
    }>;
    private generateQuery;
    private generateKey;
    private makeMetadata;
    private makePagination;
    private getTotalPageNumber;
}
