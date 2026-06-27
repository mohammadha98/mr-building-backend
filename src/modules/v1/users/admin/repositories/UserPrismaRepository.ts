import IPagination from "src/commons/contracts/IPagination";
import { IUserRepository } from "./IUserRepository";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../../../prisma/prisma.service";

@Injectable()
export default class UserPrismaRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async count(params: any): Promise<number> {
    return await this.prisma.users.count({ where: params });
  }

  async findOneByID(id: any): Promise<any> {
    return await this.prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        uniqKey: true,
        phone: true,
        avatar: true,
        token: true,
        refresh_token: true,
        status: true,
        roles: {
          select: {
            role: {
              select: {
                id: true,
                title: true,
                key: true,
                description: true,
                permissions: {
                  select: {
                    category: {
                      select: {
                        category: {
                          select: { id: true, title: true, key: true },
                        },
                      },
                    },
                    permission: {
                      select: {
                        id: true,
                        title: true,
                        key: true,
                        category: { select: { id: true } },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async updateToken(user_id: number, token: string): Promise<any> {
    return await this.prisma.users.update({
      where: { id: user_id },
      data: { token },
      select: {
        id: true,
        name: true,
        email: true,
        uniqKey: true,
        phone: true,
        avatar: true,
        token: true,
        refresh_token: true,
        status: true,
        created_at: true,
        roles: {
          select: {
            role: {
              select: {
                id: true,
                title: true,
                key: true,
                permissions: {
                  select: {
                    category: {
                      select: {
                        category: {
                          select: { id: true, title: true, key: true },
                        },
                      },
                    },
                    permission: {
                      select: {
                        id: true,
                        title: true,
                        key: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async login(email: string): Promise<any | null> {
    return await this.prisma.users.findFirst({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        uniqKey: true,
        phone: true,
        password: true,
        avatar: true,
        token: true,
        refresh_token: true,
        status: true,
        roles: {
          select: {
            role: {
              select: {
                id: true,
                title: true,
                key: true,
                description: true,
                permissions: {
                  select: {
                    category: {
                      select: {
                        category: {
                          select: { id: true, title: true, key: true },
                        },
                      },
                    },
                    permission: {
                      select: {
                        id: true,
                        title: true,
                        key: true,
                        category: { select: { id: true } },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async create(params: any): Promise<any> {
    return await this.prisma.users.create({ data: { ...params } });
  }

  async saveUserRoles(userID: number, roles: string[]): Promise<any> {
    await this.prisma.adminUserRoles.createMany({
      data: roles.map((item) => {
        return {
          roleID: item,
          userID,
        };
      }),
    });
  }

  async findOne(params: any): Promise<any | null> {
    return await this.prisma.users.findFirst({
      where: params,
      select: {
        id: true,
        name: true,
        email: true,
        uniqKey: true,
        phone: true,
        avatar: true,
        token: true,
        refresh_token: true,
        status: true,
        created_at: true,
        roles: {
          select: {
            role: {
              select: {
                id: true,
                title: true,
                key: true,
                description: true,
                permissions: {
                  select: {
                    category: {
                      select: {
                        category: {
                          select: { id: true, title: true, key: true },
                        },
                      },
                    },
                    permission: {
                      select: {
                        id: true,
                        title: true,
                        key: true,
                        category: { select: { id: true } },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async findMany(
    params: any,
    relations?: string[],
    pagination?: IPagination
  ): Promise<any[]> {
    return await this.prisma.users.findMany(params);
  }

  async updateOne(where: Partial<any>, updateData: Partial<any>): Promise<any> {
    return await this.prisma.users.update({
      where,
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        phone: true,
        token: true,
        refresh_token: true,
      },
    });
  }

  async updateMany(
    where: Partial<any>,
    updateData: Partial<any>
  ): Promise<any> {
    return await this.prisma.users.updateMany({ where, data: updateData });
  }

  async deleteOne(where: any): Promise<any> {
    return await this.prisma.users.delete({ where });
  }

  async deleteUserRoles(userID: number): Promise<any> {
    console.log({ userID });

    return await this.prisma.adminUserRoles.deleteMany({ where: { userID } });
  }

  async deleteMany(where: any): Promise<any> {
    return await this.prisma.users.deleteMany({ where });
  }
}
