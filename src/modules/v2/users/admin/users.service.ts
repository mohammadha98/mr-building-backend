import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import UserPrismaRepository from "./repositories/UserPrismaRepository";
import { hashSync, compareSync } from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import IPagination from "src/commons/contracts/IPagination";
import IMetadata from "src/commons/contracts/IMetadata";
import { UserChangePasswordDto } from "./dto/user-change-password.dto";
import { UpdateUserProfileDto } from "./dto/update-user-profile.dto copy";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { randomBytes } from "crypto";
import { UpdateUserRolesDto } from "./dto/update-user-roles.dto";
import { GetTypes } from "../../client/admin/dto/client-list.dto";
import MailerService from "src/modules/services/notifications/mailer/mailerService";
import sortingTypes from "src/commons/contracts/SortingTypes";

@Injectable()
export class UsersService {
  constructor(
    private readonly userPrismaModel: UserPrismaRepository,
    private jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly mailerService: MailerService
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const hasUser = await this.userPrismaModel.findOne({
        email: createUserDto.email,
      });
      if (hasUser === null) {
        createUserDto.password = hashSync(createUserDto.password, 10);
        const roles = createUserDto.roles as any;
        delete createUserDto.roles;

        createUserDto.uniqKey = await this.generateUniqKey();

        const newUser = await this.userPrismaModel.create(createUserDto);
        await this.userPrismaModel.saveUserRoles(newUser.id, roles);

        const token = this.jwtService.sign(
          { sub: createUserDto.uniqKey },
          { secret: process.env.JWT_SECRET_KEY_ADMIN }
        );
        const updatedUser = await this.userPrismaModel.updateToken(
          newUser.id,
          token
        );
        return { status: 200, user: updatedUser };
      }
      return { status: 409 };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  private async generateUniqKey() {
    const uniqKey = randomBytes(20).toString("base64");
    const isDuplicatedUniqKey = await this.prismaService.users.findFirst({
      where: { uniqKey },
    });
    if (isDuplicatedUniqKey) {
      await this.generateUniqKey();
    }

    return uniqKey;
  }

  async findAll(query: PaginationDto) {
    try {
      const adminUser = await this.userPrismaModel.findOneByID(query.user_id);
      if (!adminUser) {
        return { status: 403 };
      }

      let condition = {};
      if (query.type === GetTypes.search) {
        condition = {
          name: {
            contains: query.keyword,
            mode: "insensitive",
          },
        };
      }

      let orderBy: any = { id: "desc" };
      if (query.sort === sortingTypes.oldest) {
        orderBy = { id: "asc" };
      }

      const count = await this.userPrismaModel.count({ ...condition });
      const total = this.getTotalPageNumber(
        Number(count),
        Number(query.per_page)
      );

      const paginationValue = this.makePagination(
        Number(query.page),
        Number(query.per_page)
      );

      const users = await this.prismaService.users.findMany({
        where: { ...condition },
        skip: paginationValue.offset,
        take: paginationValue.per_page,
        orderBy,
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

      return {
        status: 200,
        users,
        metadata: this.makeMetadata(
          Number(query.page),
          Number(query.per_page),
          Number(total)
        ),
      };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
      };
    }
  }

  async login(email: string, password: string) {
    const user = await this.userPrismaModel.login(email);
    if (!user) {
      return { status: 400 };
    }
    const validatePassword = compareSync(password, user.password);
    return validatePassword ? { status: 200, user } : { status: 400 };
  }

  async getUserInfo(userInfoDto: any) {
    const userInfo = await this.userPrismaModel.findOne({
      uniqKey: userInfoDto.user_key,
    });
    if (!userInfo) {
      return { status: 400 };
    }
    return { status: 200, user: userInfo };
  }

  async tokenValidaion(id: number) {
    const user = await this.userPrismaModel.findOneByID(id);
    if (!user) {
      return { status: 403 };
    }
    return { status: 200, user };
  }

  async updateUser(updateUserDto: UpdateUserDto) {
    const userInfo = await this.userPrismaModel.findOne({
      uniqKey: updateUserDto.user_key,
    });
    if (!userInfo) {
      return { status: 400 };
    }

    const validateEmail = await this.prismaService.users.findFirst({
      where: {
        email: updateUserDto.email,
        NOT: {
          id: userInfo.id,
        },
      },
    });
    if (validateEmail) {
      return { status: 409 };
    }

    await this.userPrismaModel.updateOne(
      { id: userInfo.id },
      {
        name: updateUserDto.name,
        email: updateUserDto.email,
      }
    );
    return { status: 200 };
  }

  async updateRoles(body: UpdateUserRolesDto) {
    const userInfo = await this.userPrismaModel.findOne({
      uniqKey: body.user_key,
    });
    if (!userInfo) {
      return { status: 400 };
    }

    await this.updateUserRoles(userInfo.id, body.roles);

    return { status: 200 };
  }

  private async updateUserRoles(user_id: number, roles: string[]) {
    await this.prismaService.adminUserRoles.deleteMany({
      where: { userID: user_id },
    });
    await this.userPrismaModel.saveUserRoles(user_id, roles);
  }

  async updateUserProfile(updateUserDto: UpdateUserProfileDto) {
    const validateUserTokenID = await this.userPrismaModel.findOne({
      id: Number(updateUserDto.user_id),
    });
    if (!validateUserTokenID) {
      return { status: 403 };
    }
    const userInfo = await this.userPrismaModel.findOne({
      id: Number(updateUserDto.user_id),
    });
    if (!userInfo) {
      return { status: 400 };
    }
    await this.userPrismaModel.updateOne(
      { id: Number(updateUserDto.user_id) },
      {
        name: updateUserDto.name,
      }
    );
    return { status: 200 };
  }

  async removeUser(user_id: number) {
    const userInfo = await this.userPrismaModel.findOne({
      id: Number(user_id),
    });
    if (!userInfo) {
      return { status: 400 };
    }
    await this.userPrismaModel.deleteUserRoles(Number(user_id));
    await this.userPrismaModel.deleteOne({ id: Number(user_id) });
    return { status: 200 };
  }

  async changePassword(changePasswordDto: UserChangePasswordDto) {
    const userInfo = await this.userPrismaModel.findOne({
      id: Number(changePasswordDto.user_id),
    });
    if (!userInfo) {
      return { status: 400 };
    }

    changePasswordDto.password = hashSync(changePasswordDto.password, 10);
    await this.userPrismaModel.updateOne(
      { id: Number(changePasswordDto.user_id) },
      {
        password: changePasswordDto.password,
      }
    );
    return { status: 200 };
  }

  async validateWithID(user_id: number) {
    const user = await this.userPrismaModel.findOneByID(Number(user_id));
    if (!user) {
      return false;
    }
    return user;
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
