export class SendMessageRealEstateWsServerDto {
  client_id: number;
  socket_id: string;
  user_key: string;
  destination_id: string;
  destination_phone: string;
  source_phone: string;
  destination_socket_id: string;
  chat_id: number;
  message_side: string;
  key: string;
  size: number;
  length: number;
  content: string;
  type: string;
  thumbnail: string;
  chat_type: string; // personal, estate_agent
  source: string;
  private_id: string;
}

export class LeaveAdvisorRoleInRealEstateDto {
  client_id: number;
  agent_id: number;
  advisor_id: number;
}
