export class ChangeStatusFoNotificationAlertWsServerDto {
  user_key: string;
  item_id: number;
  client_id: number;
  member_is_muted: boolean;
  target: string; // channel_messenger, group_messenger, chat_messenger
}
