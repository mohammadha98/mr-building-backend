export class UpdateChannelMessenger {
  id: number;
  owner_id: number;
  is_owner: boolean;
  key: string;
  title: string;
  member_count: number;
  description: string;
  avatar: string;
  type: string;
  tag: string;
  link: string;
  number_of_unread_messages: number;
  last_message: [];
  last_message_time: {
    day: number;
    month: string;
    year: number;
    time: string;
  };
}
