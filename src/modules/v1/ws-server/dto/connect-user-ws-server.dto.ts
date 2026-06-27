import { IsString } from "class-validator";

export class ConnectUserWsServerDto {
  client_id: number;
  socket_id: string;
  @IsString()
  phone: string;

  tag: string; // exit
}
