export class SeenMessageInMessengerWsServerDto {
  client_id: number;
  chat_key: string;
  message_ids: [number];
  source_key: string;
  destination_key: string;
  destination_phone: string;
}
