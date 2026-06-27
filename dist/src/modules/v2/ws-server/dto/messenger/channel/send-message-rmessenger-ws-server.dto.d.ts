export declare class StartChatInMessengerDTO {
    client_id: number;
    destination_phone: string;
    chat_key: string;
}
export declare class SendMessageMessengerWsServerDto {
    client_id: number;
    message_id: number;
    is_blocked: boolean;
    is_edited: boolean;
    is_forwarded: boolean;
    source_key: string;
    destination_id: number;
    destination_key: string;
    source_phone: string;
    destination_phone: string;
    key: string;
    content: string;
    caption: string;
    type: string;
    size: number;
    length: number;
    thumbnail: string;
    chat_blocking_status: boolean;
    private_id: string;
    action_type: string;
    is_reply: boolean;
    reply_to: number;
    forward_message_id: number;
    forward_from: string;
    forward_from_id: number;
}
export declare class sendMessageForSaveMessage {
    client_id: number;
    key: string;
    save_message_id: number;
    private_id: string;
    message_id: number;
    content: string;
    caption: string;
    type: string;
    size: number;
    length: number;
    thumbnail: string;
    action_type: string;
    forward_message_id: number;
    forward_from: string;
    forward_from_id: number;
}
export declare class ForwardMessageInSaveMessage {
    client_id: number;
    key: string;
    save_message_id: number;
    private_id: string;
    messages: IForwardMessage[];
}
interface IForwardMessage {
    message_id: number;
    is_blocked: boolean;
    is_forwarded: boolean;
    content: string;
    caption: string;
    type: string;
    size: number;
    length: number;
    thumbnail: string;
    action_type: string;
    forward_message_id: number;
    forward_from: string;
    forward_from_id: number;
    chat_blocking_status: boolean;
    private_id: string;
}
export declare class ForwardMessageInPrivateChatWsServerDto {
    client_id: number;
    key: string;
    source_key: string;
    destination_id: number;
    destination_key: string;
    source_phone: string;
    destination_phone: string;
    messages: IForwardMessage[];
}
export {};
