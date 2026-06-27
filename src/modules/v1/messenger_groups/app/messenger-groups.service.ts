import { Injectable } from "@nestjs/common";
import { CreateGroupDto } from "./dto/create-group.dto";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { GetGroupsDto } from "./dto/get-groups.dto";
import IPagination from "src/commons/contracts/IPagination";
import IMetadata from "src/commons/contracts/IMetadata";
import { GetGroupsMessagesDto } from "./dto/get-messages.dto";
import { randomBytes } from "crypto";
import { JoinGroupDto } from "./dto/join-group.dto";
import UploadService from "src/modules/services/UploadService";
import { UpdateGroupTypeDto } from "./dto/update-group-type.dto";
import MessengerChannelTypes from "src/commons/contracts/MessengerChannelTypes";
import { GetGroupMembersDto } from "./dto/getMembers";
import { GetGroupInfoDto } from "./dto/get-group-info";
import { LeftMessenger } from "src/modules/v1/ws-server/dto/messenger/LeftMessenger";
import FcmNotificationService from "src/modules/services/notifications/fcm/FcmNotificationService";
import { NotificationsService } from "../../notifications/app/notifications.service";
import UploaderSources from "src/commons/contracts/UploaderSources";
import { ChangeMemberRoleToAdminGroup } from "../../ws-server/dto/messenger/channel/add-members-messenger-ws-server.dto";
import MessengerGroupsTransformer from "./Transformer";
import { ForwardMessagesInGroupMessengerDto } from "../../ws-server/dto/messenger/channel/send-messege-group-ws-server.dto";

@Injectable()
export class MessengerGroupsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly fcmNotificationService: FcmNotificationService,
    private readonly uploadService: UploadService,
    private readonly messengerGroupsTransformer: MessengerGroupsTransformer
  ) {}

  // createGroup
  async createGroup(body: CreateGroupDto) {
    try {
      let key = "";
      let username = "";
      let result;
      let isExistGroup = null;

      if (body.group_id) {
        isExistGroup = await this.prismaService.messengerGroups.findFirst({
          where: { id: Number(body.group_id) },
          select: {
            id: true,
            key: true,
            title: true,
            description: true,
            avatar: true,
            type: true,
            username: true,
            notification: true,
            owner_id: true,
            number_of_messages: true,
            last_message_time: true,
            messages: {
              take: 1,
              orderBy: { created_at: "desc" },
              select: {
                owner: {
                  select: {
                    id: true,
                    name: true,
                    surname: true,
                    avatar: true,
                  },
                },
                id: true,
                owner_id: true,
                size: true,
                length: true,
                type: true,
                content: true,
                caption: true,
                key: true,
                created_at: true,
                group_id: true,
                thumbnail: true,
              },
            },
            members: {
              where: { client_id: Number(body.client_id) },
              select: {
                number_of_read_messages: true,
                permissions: true,
                role: true,
              },
              take: 1,
            },
          },
        });
      }

      if (isExistGroup) {
        result = await this.prismaService.messengerGroups.update({
          where: { id: Number(body.group_id) },
          data: {
            key: isExistGroup.key,
            username: isExistGroup.username,
            title: body.title,
            description: body.description,
            type: body.type,
            avatar: body.avatar ? body.avatar : isExistGroup.avatar,
          },
          select: {
            id: true,
            key: true,
            title: true,
            description: true,
            avatar: true,
            type: true,
            username: true,
            notification: true,
            owner_id: true,
            number_of_messages: true,
            last_message_time: true,
            messages: {
              take: 1,
              orderBy: { created_at: "desc" },
              select: {
                owner: {
                  select: {
                    id: true,
                    name: true,
                    surname: true,
                    avatar: true,
                    phone: true,
                  },
                },
                id: true,
                size: true,
                owner_id: true,
                length: true,
                thumbnail: true,
                type: true,
                content: true,
                caption: true,
                key: true,
                created_at: true,
                group_id: true,
                is_forwarded: true,
                action_type: true,
                forward_from: true,
                forward_from_client_id: true,
                forward_message_id: true,
                forward_from_channel_id: true,
                forward_from_channel: {
                  select: {
                    id: true,
                    title: true,
                    key: true,
                    username: true,
                    avatar: true,
                  },
                },
              },
            },
            members: {
              where: { client_id: Number(body.client_id) },
              select: {
                number_of_read_messages: true,
                permissions: true,
                role: true,
              },
              take: 1,
            },
          },
        });

        key = isExistGroup.key;
        username = isExistGroup.username;
      } else {
        key = await this.generateKey();
        username = await this.generatePrivateUsername();
        result = await this.prismaService.messengerGroups.create({
          data: {
            owner_id: Number(body.client_id),
            key,
            username,
            title: body.title,
            description: body.description,
            type: body.type,
            avatar: body.avatar ? body.avatar : "",
          },
          select: {
            id: true,
            key: true,
            title: true,
            description: true,
            avatar: true,
            type: true,
            username: true,
            notification: true,
            owner_id: true,
            number_of_messages: true,
            last_message_time: true,
            messages: {
              take: 1,
              orderBy: { created_at: "desc" },
              select: {
                owner: {
                  select: {
                    id: true,
                    name: true,
                    surname: true,
                    avatar: true,
                    phone: true,
                  },
                },
                id: true,
                size: true,
                owner_id: true,
                length: true,
                thumbnail: true,
                type: true,
                content: true,
                caption: true,
                key: true,
                created_at: true,
                group_id: true,
                is_forwarded: true,
                action_type: true,
                forward_from: true,
                forward_from_client_id: true,
                forward_message_id: true,
                forward_from_channel_id: true,
                forward_from_channel: {
                  select: {
                    id: true,
                    title: true,
                    key: true,
                    username: true,
                    avatar: true,
                  },
                },
              },
            },
            members: {
              where: { client_id: Number(body.client_id) },
              select: {
                number_of_read_messages: true,
                permissions: true,
                role: true,
              },
              take: 1,
            },
          },
        });

        const notificationTokens =
          await this.notificationsService.getClientNotificationToken(
            body.client_id
          );
        await this.fcmNotificationService.subscribeToTopic(
          notificationTokens,
          key
        );
      }
      result.messages = [];

      if (body.avatar) {
        // move group avatar into origin directory
        await this.uploadService.moveFile(
          body.avatar,
          "temp/files",
          `messenger/groups/${key}/avatar`
        );
      }

      const member_count = await this.countGroupMembers(result.id);
      result.member_count = member_count + 1;

      return {
        status: 200,
        result: {
          ...result,
          last_message: null,
        },
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  // joinGroup
  async joinGroup(body: JoinGroupDto) {
    try {
      const client = await this.prismaService.client.findFirst({
        where: { id: Number(body.client_id) },
      });
      if (!client) {
        return { status: 403 };
      }

      const groupInfo = await this.prismaService.messengerGroups.findFirst({
        where: { id: Number(body.group_id) },
      });
      if (!groupInfo) {
        return { status: 400 };
      }

      const isJoined =
        await this.prismaService.messengerGroupsMembers.findFirst({
          where: {
            client_id: Number(body.client_id),
            group_id: groupInfo.id,
          },
        });
      if (!isJoined) {
        await this.prismaService.messengerGroupsMembers.create({
          data: {
            group: { connect: { id: groupInfo.id } },
            client: { connect: { id: Number(body.client_id) } },
          },
        });

        const member_count = await this.countGroupMembers(groupInfo.id);

        return {
          status: 201,
          member_count,
        };
      }
      const member_count = await this.countGroupMembers(groupInfo.id);

      return {
        status: 200,
        member_count,
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  // UpdateGroupTypeDto
  async UpdateGroupTypeDto(body: UpdateGroupTypeDto) {
    try {
      const client = await this.prismaService.client.findFirst({
        where: { id: Number(body.client_id) },
      });
      if (!client) {
        return { status: 403 };
      }

      const groupInfo = await this.prismaService.messengerGroups.findFirst({
        where: { id: Number(body.group_id) },
      });
      if (!groupInfo) {
        return { status: 400 };
      }

      const validateChannelLink =
        await this.prismaService.messengerGroups.findFirst({
          where: { username: body.link },
        });
      if (
        validateChannelLink &&
        validateChannelLink.id !== Number(body.group_id)
      ) {
        const username = await this.generatePrivateUsername();
        await this.prismaService.messengerGroups.update({
          where: { id: Number(body.group_id) },
          data: {
            type: MessengerChannelTypes.private,
            username,
          },
        });
      } else {
        await this.prismaService.messengerGroups.update({
          where: { id: Number(body.group_id) },
          data: {
            type: body.channel_type,
            username: body.link,
          },
        });
      }

      return {
        status: 200,
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  async deleteMessage(message_ids: [number], type: string, room: string) {
    let deleted_messages = [];

    await Promise.all(
      message_ids.map(async (message_id) => {
        const messageInfo =
          await this.prismaService.messengerGroupsMessages.findFirst({
            where: { id: message_id },
          });

        if (messageInfo) {
          if (type === "me") {
            await this.prismaService.messengerGroupsMessages.updateMany({
              where: { id: message_id },
              data: { is_deleted: true },
            });
          } else {
            await this.prismaService.messengerGroupsMessages.delete({
              where: { id: message_id },
            });

            if (messageInfo.type !== "text") {
              const filename = messageInfo.content.split("/").slice(7)[0];
              this.uploadService.removeFile(
                filename,
                `uploader/${UploaderSources.messenger_group}/${messageInfo.key}/`
              );
            }
          }

          deleted_messages.push({
            message_id,
            type,
            room,
            owner_id: messageInfo.owner_id,
          });
        }
      })
    );
    const last_message =
      await this.prismaService.messengerGroupsMessages.findFirst({
        where: { key: room },
        orderBy: { created_at: "desc" },
        select: {
          owner: {
            select: {
              id: true,
              name: true,
              surname: true,
              avatar: true,
              phone: true,
            },
          },
          id: true,
          size: true,
          length: true,
          thumbnail: true,
          type: true,
          content: true,
          caption: true,
          key: true,
          created_at: true,
          group_id: true,
          is_forwarded: true,
          action_type: true,
          forward_from: true,
          forward_from_client_id: true,
          forward_message_id: true,
          forward_from_channel_id: true,
          forward_from_channel: {
            select: {
              id: true,
              title: true,
              key: true,
              username: true,
              avatar: true,
            },
          },
        },
      });

    let lastMessageTime = last_message?.created_at;
    if (!lastMessageTime) {
      const groupInfo = await this.prismaService.messengerGroups.findFirst({
        where: {
          key: room,
        },
      });
      lastMessageTime = groupInfo.created_at;
    }

    await this.prismaService.messengerGroups.updateMany({
      where: {
        key: room,
      },
      data: { last_message_time: lastMessageTime },
    });

    return {
      last_message,
      deleted_messages,
    };
  }

  // validateGroupLink
  async validateGroupLink(body: UpdateGroupTypeDto) {
    try {
      const client = await this.prismaService.client.findFirst({
        where: { id: Number(body.client_id) },
      });
      if (!client) {
        return { status: 403 };
      }

      const groupInfo = await this.prismaService.messengerGroups.findFirst({
        where: { id: Number(body.group_id) },
      });
      if (!groupInfo) {
        return { status: 400 };
      }

      const validateChannelLink =
        await this.prismaService.messengerGroups.findFirst({
          where: { username: body.link },
        });
      let validateStatus = true;
      if (validateChannelLink) {
        validateStatus = false;
      }

      return {
        status: 200,
        validateStatus,
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  // addMembers
  async addMembers(clients: any[], group_id: number) {
    try {
      const existMembers =
        await this.prismaService.messengerGroupsMembers.findMany({
          where: { group_id },
          select: {
            client_id: true,
          },
        });
      const existMembersIds = existMembers.map((item) => item.client_id);
      const newMemberList = clients.map((item) => item.client_id);

      const filteredMembers = newMemberList.filter(
        (item) => !existMembersIds.includes(item)
      );

      await this.prismaService.messengerGroupsMembers.createMany({
        skipDuplicates: true,
        data: filteredMembers.map((item) => ({
          client_id: item,
          group_id,
        })),
      });

      const members = await this.prismaService.messengerGroupsMembers.findMany({
        where: { group_id },
      });
      const member_ids = [];
      members.map((item) => member_ids.push(item.client_id));

      return {
        status: 200,
        member_ids,
        member_count: members.length,
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  async countGroupMembers(group_id: number) {
    return await this.prismaService.messengerGroupsMembers.count({
      where: {
        group_id,
      },
    });
  }

  async ChangeMemberRoleToAdminGroup(body: ChangeMemberRoleToAdminGroup) {
    try {
      const parent_ids = body.member.parent_ids;

      await this.prismaService.messengerGroupsMembers.updateMany({
        where: {
          client_id: body.member.client_id,
          group_id: body.group_info.id,
        },
        data: {
          creator_id: body.client_id,
          parent_ids,
          role: body.member.role,
          permissions: body.member.permissions,
        },
      });

      const memberInfo =
        await this.prismaService.messengerGroupsMembers.findFirst({
          where: {
            client_id: body.member.client_id,
            group_id: body.group_info.id,
          },
          orderBy: { created_at: "desc" },
          select: {
            id: true,
            creator_id: true,
            parent_ids: true,
            role: true,
            permissions: true,
            client: {
              select: {
                id: true,
                key: true,
                phone: true,
                avatar: true,
                name: true,
                surname: true,
              },
            },
          },
        });

      return this.messengerGroupsTransformer.memberTransform(memberInfo);
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  // leaveGroup
  async leaveGroup(body: LeftMessenger) {
    try {
      const client = await this.prismaService.client.findFirst({
        where: { id: Number(body.client_id) },
      });
      if (!client) {
        return { status: 403 };
      }

      const groupInfo = await this.prismaService.messengerGroups.findFirst({
        where: { id: Number(body.item_id) },
      });
      if (!groupInfo) {
        return { status: 400 };
      }

      await this.prismaService.messengerGroupsMembers.deleteMany({
        where: {
          group_id: Number(body.item_id),
          client_id: Number(body.client_id),
        },
      });

      const members = await this.prismaService.messengerGroupsMembers.findMany({
        where: { group_id: body.item_id },
      });
      const member_ids = [];
      members.map((item) => member_ids.push(item.client_id));

      return {
        status: 201,
        member_ids,
        member_count: members.length,
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  // get My Groups
  async getMyGroups(body: GetGroupsDto) {
    try {
      const client = await this.prismaService.client.findFirst({
        where: { id: Number(body.client_id) },
      });
      if (!client) {
        return { status: 403 };
      }
      const groups = await this.getMessengerGroups(client.id);

      return {
        status: 200,
        groups,
      };
    } catch (error) {
      return { status: 500 };
    }
  }

  private async getMessengerGroups(client_id: number) {
    const groups = await this.prismaService.messengerGroups.findMany({
      where: {
        OR: [
          { owner_id: client_id },
          { members: { some: { client_id: client_id } } },
        ],
      },
      select: {
        id: true,
        key: true,
        title: true,
        description: true,
        avatar: true,
        type: true,
        username: true,
        notification: true,
        owner_id: true,
        number_of_messages: true,
        last_message_time: true,
        messages: {
          take: 1,
          orderBy: { created_at: "desc" },
          select: {
            owner: {
              select: {
                id: true,
                name: true,
                surname: true,
                avatar: true,
                phone: true,
              },
            },
            id: true,
            size: true,
            length: true,
            thumbnail: true,
            type: true,
            content: true,
            caption: true,
            key: true,
            created_at: true,
            group_id: true,
            is_forwarded: true,
            action_type: true,
            forward_from: true,
            forward_from_client_id: true,
            forward_message_id: true,
            forward_from_channel_id: true,
            forward_from_channel: {
              select: {
                id: true,
                title: true,
                key: true,
                username: true,
                avatar: true,
              },
            },
            is_replied: true,
            reply_to: {
              select: {
                owner: {
                  select: {
                    id: true,
                    name: true,
                    surname: true,
                    avatar: true,
                    phone: true,
                  },
                },
                id: true,
                size: true,
                length: true,
                thumbnail: true,
                type: true,
                content: true,
                caption: true,
                key: true,
                created_at: true,
                group_id: true,
              },
            },
          },
        },
        members: {
          where: { client_id },
          select: {
            id: true,
            parent_ids: true,

            number_of_read_messages: true,
            permissions: true,
            role: true,
          },
          take: 1,
        },
      },
      orderBy: { last_message_time: "desc" },
    });
    const presentedGroups = await this.presentedGroups(groups, client_id);

    return await this.getGroupsInfo(presentedGroups);
  }

  private async presentedGroups(groups: any[], client_id: number) {
    return await Promise.all(
      groups.map(async (item) => {
        let data = item as any;

        let message = [];
        if (data.messages.length > 0) {
          message = data.messages;
        }

        if (message.length > 0) {
          if (message[0].is_forwarded) {
            let forward_from_client = null;
            let forward_from_channel = null;
            if (message[0].forward_from === "user") {
              const clientInfo = await this.prismaService.client.findFirst({
                where: { id: message[0].forward_from_client_id },
              });
              if (clientInfo) {
                forward_from_client = {
                  id: clientInfo.id,
                  key: clientInfo.key,
                  name: clientInfo.name,
                  surname: clientInfo.surname,
                  avatar: clientInfo.avatar,
                };
              }
            } else if (message[0].forward_from === "channel") {
              forward_from_channel = {
                id: message[0].forward_from_channel.id,
                title: message[0].forward_from_channel.title,
                key: message[0].forward_from_channel.username,
                avatar: message[0].forward_from_channel.avatar,
              };
            }
            message[0].forward_from_client = forward_from_client;
            message[0].forward_from_channel = forward_from_channel;
          }
        }

        data.messages = message;
        return data;
      })
    );
  }

  // get My groupInfo
  async groupInfo(body: GetGroupInfoDto) {
    try {
      const client = await this.prismaService.client.findFirst({
        where: { id: Number(body.client_id) },
      });
      if (!client) {
        return { status: 403 };
      }

      const groups = await this.prismaService.messengerGroups.findMany({
        where: {
          username: body.username,
        },
        select: {
          id: true,
          key: true,
          title: true,
          description: true,
          avatar: true,
          type: true,
          username: true,
          notification: true,
          owner_id: true,
          number_of_messages: true,
          last_message_time: true,
          messages: {
            take: 1,
            orderBy: { created_at: "desc" },
            select: {
              owner: {
                select: {
                  id: true,
                  name: true,
                  surname: true,
                  avatar: true,
                  phone: true,
                },
              },
              id: true,
              size: true,
              length: true,
              thumbnail: true,
              type: true,
              content: true,
              caption: true,
              key: true,
              created_at: true,
              group_id: true,
              is_forwarded: true,
              action_type: true,
              forward_from: true,
              forward_from_client_id: true,
              forward_message_id: true,
              forward_from_channel_id: true,
              forward_from_channel: {
                select: {
                  id: true,
                  title: true,
                  key: true,
                  username: true,
                  avatar: true,
                },
              },
            },
          },
          members: {
            where: { client_id: Number(body.client_id) },
            select: {
              id: true,
              parent_ids: true,

              number_of_read_messages: true,
              permissions: true,
              role: true,
            },
            take: 1,
          },
        },
        orderBy: { last_message_time: "desc" },
      });

      if (groups.length === 0) {
        return { status: 400 };
      }

      let presentedData = await Promise.all(
        groups.map(async (item) => {
          let data = item as any;

          let message = [];
          if (data.messages.length > 0) {
            message = data.messages;
          }

          if (message.length > 0) {
            if (message[0].is_forwarded) {
              let forward_from_client = null;
              let forward_from_channel = null;
              if (message[0].forward_from === "user") {
                const clientInfo = await this.prismaService.client.findFirst({
                  where: { id: message[0].forward_from_client_id },
                });
                if (clientInfo) {
                  forward_from_client = {
                    id: clientInfo.id,
                    key: "",
                    name: clientInfo.name,
                    surname: clientInfo.surname,
                    avatar: clientInfo.avatar,
                  };
                }
              } else if (message[0].forward_from === "channel") {
                forward_from_channel = {
                  id: message[0].forward_from_channel.id,
                  title: message[0].forward_from_channel.title,
                  key: message[0].forward_from_channel.username,
                  avatar: message[0].forward_from_channel.avatar,
                };
              }
              message[0].forward_from_client = forward_from_client;
              message[0].forward_from_channel = forward_from_channel;
            }
          }

          data.messages = message;
          return data;
        })
      );
      const presentedGroups = await this.getGroupsInfo(presentedData);

      return {
        status: 200,
        groups: presentedGroups,
        has_joined: groups[0].members.length > 0 ? true : false,
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  async getGroupsInfo(groups: any[]) {
    return await Promise.all(
      groups.map(async (item) => {
        const members =
          await this.prismaService.messengerGroupsMembers.findMany({
            where: { group_id: item.id },
          });
        item.member_count = members.length + 1;
        const ids = [];
        members.map((item) => ids.push(item.client_id));
        item.member_ids = ids;
        return item;
      })
    );
  }

  // getMembers
  async getMembers(body: GetGroupMembersDto) {
    try {
      const client = await this.prismaService.client.findFirst({
        where: { id: Number(body.client_id) },
      });
      if (!client) {
        return { status: 403 };
      }

      const groupInfo = await this.prismaService.messengerGroups.findFirst({
        where: { id: Number(body.group_id) },
      });
      if (!groupInfo) {
        return { status: 400 };
      }
      const members = await this.prismaService.messengerGroupsMembers.findMany({
        where: { group_id: Number(body.group_id) },
        orderBy: { created_at: "desc" },
        select: {
          id: true,
          creator_id: true,
          parent_ids: true,
          role: true,
          permissions: true,
          client: {
            select: {
              id: true,
              phone: true,
              key: true,
              avatar: true,
              name: true,
              surname: true,
            },
          },
        },
      });
      const ownerInfo = await this.prismaService.client.findFirst({
        where: { id: groupInfo.owner_id },
      });
      members.unshift({
        id: 1,
        creator_id: 1,
        parent_ids: [1],
        role: "owner",
        permissions: ["owner"],
        client: {
          id: ownerInfo.id,
          key: ownerInfo.key,
          phone: ownerInfo.phone,
          avatar: ownerInfo.avatar,
          name: ownerInfo.name,
          surname: ownerInfo.surname,
        },
      });

      return {
        status: 200,
        members,
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  // getMessages
  async getMessages(body: GetGroupsMessagesDto) {
    try {
      const client = await this.prismaService.client.findFirst({
        where: { id: Number(body.client_id) },
      });
      if (!client) {
        return { status: 403 };
      }

      const count = await this.prismaService.messengerGroupsMessages.count({
        where: {
          group_id: Number(body.group_id),
        },
      });

      const total = this.getTotalPageNumber(
        Number(count),
        Number(body.per_page)
      );

      const paginationValue = this.makePagination(
        Number(body.page),
        Number(body.per_page)
      );

      const messages =
        await this.prismaService.messengerGroupsMessages.findMany({
          where: { group_id: Number(body.group_id) },
          skip: paginationValue.offset,
          take: paginationValue.per_page,
          orderBy: { created_at: "desc" },
          select: {
            owner: {
              select: {
                id: true,
                name: true,
                surname: true,
                avatar: true,
                phone: true,
              },
            },
            id: true,
            size: true,
            length: true,
            thumbnail: true,
            type: true,
            content: true,
            caption: true,
            key: true,
            created_at: true,
            group_id: true,
            is_forwarded: true,
            action_type: true,
            forward_from: true,
            forward_from_client_id: true,
            forward_message_id: true,
            forward_from_channel_id: true,
            forward_from_channel: {
              select: {
                id: true,
                title: true,
                key: true,
                username: true,
                avatar: true,
              },
            },
            is_replied: true,
            reply_to: {
              select: {
                owner: {
                  select: {
                    id: true,
                    name: true,
                    surname: true,
                    avatar: true,
                    phone: true,
                  },
                },
                id: true,
                size: true,
                length: true,
                thumbnail: true,
                type: true,
                content: true,
                caption: true,
                key: true,
                created_at: true,
                group_id: true,
              },
            },
          },
        });

      let presentedMessages = await Promise.all(
        messages.map(async (item) => {
          let message = item as any;

          if (message.is_forwarded) {
            let forward_from_client = null;
            let forward_from_channel = null;
            if (message.forward_from === "user") {
              const clientInfo = await this.prismaService.client.findFirst({
                where: { id: message.forward_from_client_id },
              });
              if (clientInfo) {
                forward_from_client = {
                  id: clientInfo.id,
                  key: "",
                  name: clientInfo.name,
                  surname: clientInfo.surname,
                  avatar: clientInfo.avatar,
                };
              }
            } else if (message.forward_from === "channel") {
              forward_from_channel = {
                id: message.forward_from_channel.id,
                title: message.forward_from_channel.title,
                key: message.forward_from_channel.username,
                avatar: message.forward_from_channel.avatar,
              };
            }
            message.forward_from_client = forward_from_client;
            message.forward_from_channel = forward_from_channel;
          }

          return message;
        })
      );

      let membership_status = false;
      const membership =
        await this.prismaService.messengerGroupsMembers.findFirst({
          where: {
            group_id: Number(body.group_id),
            client_id: Number(body.client_id),
          },
        });
      if (membership) {
        membership_status = true;
      }

      return {
        status: 200,
        membership_status,
        messages: presentedMessages,
        metadata: this.makeMetadata(
          Number(body.page),
          Number(body.per_page),
          Number(total)
        ),
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  private async generateKey() {
    const key = "MSGG" + randomBytes(12).toString("hex").toUpperCase();
    const isDuplicateChannelId =
      await this.prismaService.messengerGroups.findFirst({
        where: { key },
      });
    if (isDuplicateChannelId) {
      await this.generateKey();
    }
    return key;
  }

  private async generatePrivateUsername() {
    const username = "MSGGP" + randomBytes(12).toString("hex").toUpperCase();
    const isDuplicateUsername =
      await this.prismaService.messengerGroups.findFirst({
        where: { username },
      });
    if (isDuplicateUsername) {
      await this.generatePrivateUsername();
    }
    return username;
  }

  public async generateUsernameForGroup(group_id: number) {
    const isValidGroup = await this.prismaService.messengerGroups.findFirst({
      where: { id: Number(group_id) },
    });
    if (!isValidGroup) {
      return { status: 400 };
    }

    const username = "GP-" + randomBytes(12).toString("hex").toUpperCase();
    const isDuplicateUsername =
      await this.prismaService.messengerGroups.findFirst({
        where: { username },
      });
    if (isDuplicateUsername) {
      await this.generatePrivateUsername();
    }

    await this.prismaService.messengerGroups.update({
      where: { id: Number(group_id) },
      data: { username },
    });
    return { username };
  }

  async findOneByID(item_id: number) {
    return await this.prismaService.messengerGroups.findFirst({
      where: { id: Number(item_id) },
    });
  }

  async saveNewMessage(body: any, client_id: number) {
    try {
      let message;
      if (body.is_edited && body.message_id) {
        await this.prismaService.messengerGroupsMessages.update({
          where: { id: Number(body.message_id) },
          data: {
            content: body.content,
            caption: body.caption,
            type: body.type,
            length: body.length,
            size: body.size,
            thumbnail: body.thumbnail,
          },
        });

        message = await this.prismaService.messengerGroups.findFirst({
          where: { id: body.group_id },
          select: {
            id: true,
            key: true,
            title: true,
            description: true,
            avatar: true,
            type: true,
            username: true,
            notification: true,
            owner_id: true,
            number_of_messages: true,
            last_message_time: true,
            messages: {
              where: {
                id: Number(body.message_id),
              },
              take: 1,
              orderBy: { created_at: "desc" },
              select: {
                owner: {
                  select: {
                    id: true,
                    name: true,
                    surname: true,
                    avatar: true,
                    phone: true,
                  },
                },
                id: true,
                size: true,
                length: true,
                thumbnail: true,
                type: true,
                content: true,
                caption: true,
                key: true,
                created_at: true,
                group_id: true,
                is_forwarded: true,
                action_type: true,
                forward_from: true,
                forward_from_client_id: true,
                forward_message_id: true,
                forward_from_channel_id: true,
                forward_from_channel: {
                  select: {
                    id: true,
                    title: true,
                    key: true,
                    username: true,
                    avatar: true,
                  },
                },
              },
            },
            members: {
              where: { client_id: Number(body.client_id) },
              select: {
                number_of_read_messages: true,
                permissions: true,
                role: true,
              },
              take: 1,
            },
          },
        });
      } else {
        let data: any = {
          content: body.content,
          caption: body.caption,
          action_type: body.action_type,
          is_replied: body.is_reply,
          key: body.key,
          type: body.type,
          owner: { connect: { id: Number(client_id) } },
          group: { connect: { id: body.group_id } },
          length: body.length,
          size: body.size,
          thumbnail: body.thumbnail,
        };
        if (body.is_reply && body.action_type === "reply") {
          data.reply_to = { connect: { id: +body.reply_to } };
        }
        await this.prismaService.messengerGroupsMessages.create({
          data,
        });

        message = await this.prismaService.messengerGroups.findFirst({
          where: { id: body.group_id },
          select: {
            id: true,
            key: true,
            title: true,
            description: true,
            avatar: true,
            type: true,
            username: true,
            notification: true,
            owner_id: true,
            number_of_messages: true,
            last_message_time: true,
            messages: {
              take: 1,
              orderBy: { created_at: "desc" },
              select: {
                owner: {
                  select: {
                    id: true,
                    name: true,
                    surname: true,
                    avatar: true,
                    phone: true,
                  },
                },
                id: true,
                size: true,
                length: true,
                thumbnail: true,
                type: true,
                content: true,
                caption: true,
                key: true,
                created_at: true,
                group_id: true,
                is_forwarded: true,
                action_type: true,
                forward_from: true,
                forward_from_client_id: true,
                forward_message_id: true,
                forward_from_channel_id: true,
                forward_from_channel: {
                  select: {
                    id: true,
                    title: true,
                    key: true,
                    username: true,
                    avatar: true,
                  },
                },
                is_replied: true,
                reply_to: {
                  select: {
                    owner: {
                      select: {
                        id: true,
                        name: true,
                        surname: true,
                        avatar: true,
                        phone: true,
                      },
                    },
                    id: true,
                    size: true,
                    length: true,
                    thumbnail: true,
                    type: true,
                    content: true,
                    caption: true,
                    key: true,
                    created_at: true,
                    group_id: true,
                  },
                },
              },
            },
            members: {
              where: { client_id: Number(body.client_id) },
              select: {
                number_of_read_messages: true,
                permissions: true,
                role: true,
              },
              take: 1,
            },
          },
        });
      }

      await this.prismaService.messengerGroups.update({
        where: { id: body.group_id },
        data: { last_message_time: new Date(Date.now()) },
      });

      return message;
    } catch (error) {
      console.log(error);
    }
  }

  private async copyFileForForward(
    content: string,
    key: string,
    enumSource: string
  ) {
    const sourcePath = content.split("/").slice(4).join("/");
    const destinationPath = `uploader/${enumSource}/${key}`;

    const filename = content.split("/").slice(4)[3];
    console.log({ filename });
    return await this.uploadService.copyFile(
      sourcePath,
      destinationPath,
      filename
    );
  }

  async forwardMessage(messageBody: ForwardMessagesInGroupMessengerDto) {
    try {
      let messages = messageBody.messages;

      for (let index = 0; index < messageBody.messages.length; index++) {
        let body = messageBody.messages[index];

        if (body.type !== "text") {
          body.content = await this.copyFileForForward(
            body.content,
            messageBody.key,
            UploaderSources.messenger_group
          );
        }

        let data: any = {
          is_forwarded: body.is_forwarded,
          forward_message_id: body.forward_message_id,
          action_type: body.action_type,
          forward_from: body.forward_from,
          content: body.content,
          caption: body.caption,
          owner: { connect: { id: messageBody.client_id } },
          group: { connect: { id: messageBody.group_id } },
          key: messageBody.key,
          type: body.type,
          length: body.length,
          size: body.size,
          thumbnail: body.thumbnail,
        } as any;

        let forward_from_client = null;
        if (body.forward_from === "user") {
          data.forward_from_client_id = body.forward_from_id;

          const clientInfo = await this.prismaService.client.findFirst({
            where: { id: body.forward_from_id },
          });
          if (clientInfo) {
            forward_from_client = {
              id: clientInfo.id,
              key: "",
              title: clientInfo.name + " " + clientInfo.surname,
              avatar: clientInfo.avatar,
            };
          }
        } else if (body.forward_from === "channel") {
          data.forward_from_channel = {
            connect: { id: body.forward_from_id },
          };
        }

        const newMessege =
          (await this.prismaService.messengerGroupsMessages.create({
            data,
            select: {
              owner: {
                select: {
                  id: true,
                  name: true,
                  surname: true,
                  avatar: true,
                  phone: true,
                },
              },
              id: true,
              size: true,
              length: true,
              thumbnail: true,
              type: true,
              content: true,
              caption: true,
              key: true,
              created_at: true,
              group_id: true,
              is_forwarded: true,
              action_type: true,
              forward_from: true,
              forward_from_client_id: true,
              forward_message_id: true,
              forward_from_channel_id: true,
              forward_from_channel: {
                select: {
                  id: true,
                  title: true,
                  key: true,
                  username: true,
                  avatar: true,
                },
              },
            },
          })) as any;

        newMessege.forward_from_client = forward_from_client;
        newMessege.private_id = body.private_id;

        messages[index] = newMessege;
      }

      await this.prismaService.messengerGroups.update({
        where: { id: messageBody.group_id },
        data: { last_message_time: new Date(Date.now()) },
      });

      let groupInfo = (await this.prismaService.messengerGroups.findFirst({
        where: { id: messageBody.group_id },
        select: {
          id: true,
          key: true,
          title: true,
          description: true,
          avatar: true,
          type: true,
          username: true,
          notification: true,
          owner_id: true,
          number_of_messages: true,
          last_message_time: true,
          members: {
            where: { client_id: messageBody.client_id },
            select: {
              id: true,
              parent_ids: true,
              number_of_read_messages: true,
              permissions: true,
              role: true,
            },
            take: 1,
          },
        },
      })) as any;
      groupInfo.messages = messages;
      const members = groupInfo.members.length > 0 ? groupInfo.members : null;
      if (!members) {
        const ownerInfo = await this.prismaService.client.findFirst({
          where: { id: messageBody.client_id },
        });
        members.unshift({
          id: 1,
          creator_id: 1,
          parent_ids: [1],
          role: "owner",
          permissions: ["owner"],
          client: {
            id: ownerInfo.id,
            key: ownerInfo.key,
            phone: ownerInfo.phone,
            avatar: ownerInfo.avatar,
            name: ownerInfo.name,
            surname: ownerInfo.surname,
          },
        });
        groupInfo.members = [members];
      }

      const groupTransformer = this.messengerGroupsTransformer.transform(
        groupInfo,
        messageBody.client_id
      );

      return groupTransformer;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteGroup(body: any) {
    try {
      const groupInfo = await this.prismaService.messengerGroups.findFirst({
        where: {
          owner_id: body.client_id,
          id: body.group_id,
          key: body.key,
        },
      });

      const members = await this.prismaService.messengerGroupsMembers.findMany({
        where: { group_id: groupInfo.id },
        select: {
          client_id: true,
        },
      });

      await this.prismaService.messengerGroupsMembers.deleteMany({
        where: { group_id: Number(groupInfo.id) },
      });

      await this.prismaService.messengerGroupsMessages.deleteMany({
        where: { group_id: Number(groupInfo.id) },
      });
      await this.prismaService.messengerGroups.delete({
        where: {
          id: Number(body.group_id),
        },
      });
      await this.uploadService.removeDir(`messenger/${groupInfo.key}`);

      return members;
    } catch (error) {
      console.log(error);
    }
  }

  async getGroupsKey(client_id: number) {
    const groupsJoined =
      await this.prismaService.messengerGroupsMembers.findMany({
        where: { client_id: Number(client_id) },
        select: { group: { select: { key: true } } },
      });

    const groupsIsOwner = await this.prismaService.messengerGroups.findMany({
      where: { owner_id: Number(client_id) },
    });

    const ownerGroups = groupsIsOwner.map((item) => {
      return { group: { key: item.key } };
    });
    const groupList = [...groupsJoined, ...ownerGroups];
    return groupList;
  }

  async findMessagesByID(item_id: number) {
    return await this.prismaService.messengerGroupsMessages.findFirst({
      where: { id: Number(item_id) },
      select: {
        id: true,
        content: true,
        caption: true,
      },
    });
  }

  // make metadata
  private makeMetadata(
    page: number,
    per_page: number,
    total_page: number
  ): IMetadata {
    return {
      page,
      total_page,
      per_page: per_page,
      next: page < total_page,
      back: page > 1,
    };
  }

  // make metadata
  private makePagination(page: number, per_page: number): IPagination {
    return {
      offset: (page - 1) * per_page,
      per_page,
    };
  }

  private getTotalPageNumber(total_number: number, per_page: number) {
    return Math.ceil(total_number / per_page);
  }
}
