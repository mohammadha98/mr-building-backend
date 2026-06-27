export class SeenMessageWsServerDto {
  client_id: number;
  socket_id: string;
  message_id: number;
  destination_phone: string;
  destination_socket_id: string;
  source: string;
  key: string;
}
