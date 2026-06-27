export declare class SendMessegeInChannelMessengerWsServerDto {
    client_id: number;
    action_type: string;
    is_reply: boolean;
    reply_to: number;
    channel_id: number;
    message_id: number;
    is_edited: boolean;
    key: string;
    type: string;
    content: string;
    length: number;
    size: number;
    thumbnail: string;
    private_id: string;
    forward_message_id: number;
    forward_from: string;
    forward_from_id: number;
}
export declare class ForwardMessageIntoChannelMessengerDto {
    client_id: number;
    channel_id: number;
    key: string;
    messages: IForwardMessageIntoChannelMessenger[];
}
export interface IForwardMessageIntoChannelMessenger {
    message_id: number;
    is_edited: boolean;
    is_forwarded: boolean;
    content: string;
    length: number;
    size: number;
    type: string;
    caption: string;
    thumbnail: string;
    private_id: string;
    action_type: string;
    forward_message_id: number;
    forward_from: string;
    forward_from_id: number;
}
