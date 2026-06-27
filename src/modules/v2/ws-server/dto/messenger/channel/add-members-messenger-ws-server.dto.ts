interface IChannelMember {
  id: number;
  user_key: string;
  notification_token: string;
}

export class AddMembersInMessengerWsServerDto {
  client_id: number;

  source_key: string;
  members: IChannelMember[];
  source: string;
  channel_info: {
    id: number;
    owner_id: number;
    member_count: number;
    is_owner: boolean;
    key: string;
    title: string;
    description: string;
    avatar: string;
    source: string;
    type: string;
    link: string;
    number_of_unread_messages: number;
    last_message: object;
    last_message_time: object;
  };
}

interface IChannelMemberPermissions {
  client_id: number;
  user_key: string;
  role: string; // owner, member, admin
  permissions: string[]; // owner | permission list
  parent_ids: number[];
}

export class ChangeMemberRoleToAdminChannel {
  client_id: number;

  source_key: string;
  member: IChannelMemberPermissions;
  source: string;
  channel_info: {
    id: number;
    is_owner: boolean;
    key: string;
  };
}
export class ChangeMemberRoleToAdminGroup {
  client_id: number;

  source_key: string;
  member: IChannelMemberPermissions;
  source: string;
  group_info: {
    id: number;
    is_owner: boolean;
    key: string;
  };
}
