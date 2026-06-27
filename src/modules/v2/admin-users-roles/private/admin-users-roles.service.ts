import { Injectable } from "@nestjs/common";
import { CreateCategoryRolePermissionsDto } from "./dto/create-category-role-permissions";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { CreateCategoryRolesDto } from "./dto/create-category-roles";
import { AdminUserRoleCategories } from "@prisma/client";
import { UpdateCategoryRolesDto } from "./dto/update-category-roles";
import { UpdatePermissionCategoryRoleDto } from "./dto/update-category-roles-permission";

@Injectable()
export class AdminUsersRolesService {
  constructor(private readonly prismaService: PrismaService) {}

  public async createCategoryRoles(
    body: CreateCategoryRolesDto
  ): Promise<AdminUserRoleCategories | any> {
    try {
      const isExistKey =
        await this.prismaService.adminUserRoleCategories.findFirst({
          where: { key: body.key },
        });
      if (isExistKey) {
        return { status: 400 };
      }
      const result = await this.prismaService.adminUserRoleCategories.create({
        data: { key: body.key, title: body.title, creator_id: body.creator_id },
        select: {
          id: true,
          title: true,
          key: true,
          createdAt: true,
          updatedAt: true,
          creator_id: true,
          permissions: {
            select: {
              id: true,
              title: true,
              key: true,
              categoryID: true,
            },
          },
        },
      });
      return { status: 200, result };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  public async UpdateCategoryRolesDto(
    body: UpdateCategoryRolesDto
  ): Promise<AdminUserRoleCategories | any> {
    try {
      const isExistKey =
        await this.prismaService.adminUserRoleCategories.findFirst({
          where: { id: body.category_id },
        });
      console.log({ isExistKey });

      if (!isExistKey) {
        return { status: 400 };
      }

      const result = await this.prismaService.adminUserRoleCategories.update({
        where: { id: body.category_id },
        data: { title: body.title, creator_id: body.creator_id, key: body.key },
        select: {
          id: true,
          title: true,
          key: true,
          permissions: {
            select: {
              id: true,
              title: true,
              key: true,
              categoryID: true,
            },
          },
        },
      });
      return { status: 200, result };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  public async UpdatePermissionCategoryRoleDto(
    body: UpdatePermissionCategoryRoleDto
  ): Promise<AdminUserRoleCategories | any> {
    try {
      const isExistKey =
        await this.prismaService.adminUserRoleCategoryPermissions.findFirst({
          where: { id: body.permission_id },
        });
      if (!isExistKey) {
        return { status: 400 };
      }
      const result =
        await this.prismaService.adminUserRoleCategoryPermissions.update({
          where: { id: body.permission_id },
          data: {
            key: body.key,
            title: body.title,
            creator_id: body.creator_id,
          },
          select: {
            id: true,
            title: true,
            key: true,
            categoryID: true,
          },
        });
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

  public async deleteCategoryRoles(category_id: string): Promise<any> {
    try {
      const categoryInfo: any =
        await this.prismaService.adminUserRoleCategories.findFirst({
          where: { id: category_id },
        });
      if (!categoryInfo) {
        return { status: 400 };
      }

      await this.prismaService.adminUserRoleCategoryPermissions.deleteMany({
        where: { categoryID: category_id },
      });
      await this.prismaService.adminUserRoleCategories.delete({
        where: { id: category_id },
      });

      return { status: 200 };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  public async deleteCategoryPermission(permission_id: string): Promise<any> {
    try {
      const result: any =
        await this.prismaService.adminUserRoleCategoryPermissions.findFirst({
          where: { id: permission_id },
        });
      console.log({ result });

      if (!result) {
        return { status: 400 };
      }

      await this.prismaService.adminUserRoleCategoryPermissions.delete({
        where: { id: permission_id },
      });

      return { status: 200 };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  public async CreateCategoryRolePermissions(
    body: CreateCategoryRolePermissionsDto
  ): Promise<CreateCategoryRolePermissionsDto | any> {
    try {
      const isExistCategory =
        await this.prismaService.adminUserRoleCategories.findFirst({
          where: { id: body.category_id },
        });
      if (!isExistCategory) {
        return { status: 400 };
      }

      const isExistKey =
        await this.prismaService.adminUserRoleCategoryPermissions.findFirst({
          where: { key: body.key },
        });
      if (isExistKey) {
        return { status: 400 };
      }
      const result =
        await this.prismaService.adminUserRoleCategoryPermissions.create({
          data: {
            key: body.key,
            title: body.title,
            creator_id: body.creator_id,
            category: { connect: { id: body.category_id } },
          },
          select: {
            id: true,
            title: true,
            key: true,
            categoryID: true,
          },
        });

      return { status: 200, result };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }
}
