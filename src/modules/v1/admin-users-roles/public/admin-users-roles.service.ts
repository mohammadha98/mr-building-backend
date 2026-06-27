import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { AdminUserRolesProfile } from "@prisma/client";
import { CreateRoleDto } from "../private/dto/create-role";
import { PaginationDto } from "src/commons/dto/pagination.dto";
import IMetadata from "src/commons/contracts/IMetadata";
import IPagination from "src/commons/contracts/IPagination";

@Injectable()
export class AdminUsersRolesService {
  constructor(private readonly prismaService: PrismaService) {}

  public async createRole(
    body: CreateRoleDto
  ): Promise<AdminUserRolesProfile | any> {
    try {
      const isExistRoleProfile =
        await this.prismaService.adminUserRolesProfile.findFirst({
          where: { key: body.key },
        });
      let result;
      if (isExistRoleProfile) {
        result = await this.prismaService.adminUserRolesProfile.update({
          where: { id: isExistRoleProfile.id },
          data: {
            title: body.title,
            description: body.description,
            creator_id: body.creator_id,
          },
          select: {
            id: true,
            title: true,
            description: true,
            key: true,
            createdAt: true,
            updatedAt: true,
            creator_id: true,
            permissions: { select: { id: true } },
            category: {
              select: {
                id: true,
                category: { select: { title: true } },
              },
            },
          },
        });
        console.log("exist");
        console.log(result);
        await Promise.all(
          result.permissions.map(async (permission) => {
            console.log("permissions");
            console.log(permission);
            await this.prismaService.adminUserRolesProfileCategoryPermisions.delete(
              { where: { id: permission.id } }
            );
          })
        );

        await Promise.all(
          result.category.map(async (category) => {
            console.log("category");
            console.log(category);
            await this.prismaService.adminUserRolesProfileCategories.delete({
              where: { id: category.id },
            });
          })
        );

        body.categories.map(async (category) => {
          const validateCategory =
            await this.prismaService.adminUserRoleCategories.findFirst({
              where: { id: category.category_id },
            });
          if (validateCategory) {
            const catInfo =
              await this.prismaService.adminUserRolesProfileCategories.create({
                data: {
                  category: { connect: { id: validateCategory.id } },
                  role: { connect: { id: result.id } },
                },
              });

            await this.prismaService.adminUserRolesProfileCategoryPermisions.createMany(
              {
                data: category.permissions.map((item) => {
                  return {
                    permissionID: item,
                    categoryID: catInfo.id,
                    roleID: result.id,
                  };
                }),
              }
            );
          }
        });
      } else {
        result = await this.prismaService.adminUserRolesProfile.create({
          data: {
            key: body.key,
            title: body.title,
            description: body.description,
            creator_id: body.creator_id,
          },
          select: {
            id: true,
            title: true,
            description: true,
            key: true,
            createdAt: true,
            updatedAt: true,
            creator_id: true,
          },
        });

        body.categories.map(async (category) => {
          const validateCategory =
            await this.prismaService.adminUserRoleCategories.findFirst({
              where: { id: category.category_id },
            });
          if (validateCategory) {
            const catInfo =
              await this.prismaService.adminUserRolesProfileCategories.create({
                data: {
                  category: { connect: { id: validateCategory.id } },
                  role: { connect: { id: result.id } },
                },
              });

            await this.prismaService.adminUserRolesProfileCategoryPermisions.createMany(
              {
                data: category.permissions.map((item) => {
                  return {
                    permissionID: item,
                    categoryID: catInfo.id,
                    roleID: result.id,
                  };
                }),
              }
            );
          }
        });
      }

      return { status: 200, result };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  public async getCategoryRoles(): Promise<any> {
    try {
      const categoryInfo: any =
        await this.prismaService.adminUserRoleCategories.findMany({
          select: {
            id: true,
            title: true,
            key: true,
            permissions: {
              select: { id: true, title: true, key: true, categoryID: true },
            },
          },
          orderBy: { createdAt: "desc" },
        });
      if (!categoryInfo) {
        return { status: 400 };
      }

      return { status: 200, categoryInfo };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  public async roleList(query: PaginationDto): Promise<any> {
    try {
      const count = await this.prismaService.adminUserRolesProfile.count({});

      const total = this.getTotalPageNumber(
        Number(count),
        Number(query.per_page)
      );

      const paginationValue = this.makePagination(
        Number(query.page),
        Number(query.per_page)
      );

      const roles: any =
        await this.prismaService.adminUserRolesProfile.findMany({
          skip: paginationValue.offset,
          take: paginationValue.per_page,
          select: {
            id: true,
            title: true,
            description: true,
            key: true,
            category: {
              select: {
                category: { select: { id: true, title: true, key: true } },
              },
            },
            permissions: {
              select: {
                permission: {
                  select: {
                    id: true,
                    title: true,
                    key: true,
                    category: { select: { key: true } },
                  },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        });

      return {
        status: 200,
        roles,
        metadata: this.makeMetadata(
          Number(query.page),
          Number(query.per_page),
          Number(total)
        ),
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  public async roleInfo(role_id: string): Promise<any> {
    try {
      const info: any =
        await this.prismaService.adminUserRolesProfile.findFirst({
          where: { id: role_id },
          select: {
            id: true,
            title: true,
            description: true,
            key: true,
            permissions: {
              select: {
                permission: {
                  select: {
                    id: true,
                    title: true,
                    key: true,
                    category: { select: { id: true, title: true, key: true } },
                  },
                },
              },
            },
          },
        });

      if (!info) {
        return { status: 400 };
      }

      return {
        status: 200,
        info,
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  public async deleteRole(role_id: string): Promise<any> {
    try {
      const result: any =
        await this.prismaService.adminUserRolesProfile.findFirst({
          where: { id: role_id },
          select: {
            id: true,
            title: true,
            description: true,
            key: true,
            createdAt: true,
            updatedAt: true,
            creator_id: true,
            permissions: { select: { id: true } },
            category: {
              select: {
                id: true,
                category: { select: { title: true } },
              },
            },
          },
        });

      if (!result) {
        return { status: 400 };
      }

      await Promise.all(
        result.permissions.map(async (permission) => {
          await this.prismaService.adminUserRolesProfileCategoryPermisions.delete(
            { where: { id: permission.id } }
          );
        })
      );

      await Promise.all(
        result.category.map(async (category) => {
          await this.prismaService.adminUserRolesProfileCategories.delete({
            where: { id: category.id },
          });
        })
      );

      await this.prismaService.adminUserRoles.deleteMany({
        where: { roleID: role_id },
      });

      await this.prismaService.adminUserRolesProfile.deleteMany({
        where: { id: role_id },
      });

      return { status: 200 };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
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
