interface IChannelMember {
  id: number;
  user_key: string;
}

export class AddMembersInGroupMessengerWsServerDto {
  client_id: number;

  source_key: string;
  members: IChannelMember[];
  source: string;
  group_info: {
    id: number;
    owner_id: number;
    member_ids: number[];
    member_count: number;
    is_owner: boolean;
    key: string;
    title: string;
    description: string;
    source: string;
    avatar: string;
    type: string;
    link: string;
    number_of_unread_messages: number;
    last_message: object;
    last_message_time: object;
  };
}
