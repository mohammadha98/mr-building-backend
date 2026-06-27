export class SendMessegeInGroupMessengerWsServerDto {
  client_id: number;

  action_type: string; // normal, pin, mention, join, left, forward, reply
  is_reply: boolean;
  reply_to: number;

  group_id: number;
  message_id: number;
  is_edited: boolean;
  key: string;
  type: string;
  content: string;
  length: number;
  size: number;
  thumbnail: string;
  private_id: string;
}

export class deleteMessageInMessengerDto {
  client_id: number;

  item_ids: [number];
  room: string;
  destination_phone: string;
  type: string; // me, all
}

export interface ForwardMessagesInGroupMessengerDto {
  client_id: number;

  group_id: number;
  key: string;

  messages: ForwardMessagesInGroup[];
}

export interface ForwardMessagesInGroup {
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
  action_type: string; // normal, pin, mention, join, left, forward
  forward_message_id: number;
  forward_from: string; // user | channel
  forward_from_id: number;
}
