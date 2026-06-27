export class SendMessageInMarketplaceWs {
  client_id: number;
  action_type: string; //  normal, reply, edit
  is_reply: boolean;
  is_edited: boolean;
  reply_to: number;
  chat_id: number;
  message_id: number;
  user_key: string;
  message_side: string; // starter, participant
  key: string;
  size: number;
  length: number;
  content: string;
  caption: string;
  type: string;
  thumbnail: string;
  chat_type: string; // personal, estate_agent
  source: string;
  private_id: string;
}
