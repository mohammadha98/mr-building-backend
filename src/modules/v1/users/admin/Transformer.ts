import { Injectable } from "@nestjs/common";
import adminUserRolesTransformer from "../../admin-users-roles/public/Transformer";

@Injectable()
export default class UserTransformer {
  constructor(
    private readonly adminUserRolesTransformer: adminUserRolesTransformer
  ) {}

  public transform(user: any) {
    let roleInfo = {};

    user.roles.map(({ role }) => {
      // role
      roleInfo[role.id] = {
        id: role.id,
        title: role.title,
        description: role.description,
        key: role.key,
        categories: [],
      };

      // categories
      let categories = {};
      role.permissions.map(({ category }) => {
        const categoryInfo = category.category;
        categories[categoryInfo.id] = {
          role_id: role.id,
          id: categoryInfo.id,
          title: categoryInfo.title,
          key: categoryInfo.key,
          permissions: [],
        };
      });

      // permissions
      role.permissions.map(({ permission }) => {
        const permissionInfo = permission;
        categories[permissionInfo.category.id] = {
          ...categories[permissionInfo.category.id],
          permissions: [
            ...categories[permissionInfo.category.id].permissions,
            {
              id: permissionInfo.id,
              title: permissionInfo.title,
              key: permissionInfo.key,
            },
          ],
        };
      });

      Object.keys(categories).map((item) => {
        roleInfo[categories[item].role_id] = {
          ...roleInfo[categories[item].role_id],
          categories: [
            ...roleInfo[categories[item].role_id].categories,
            categories[item],
          ],
        };
        delete categories[item].role_id;
      });
    });

    let userRoles = [];
    Object.keys(roleInfo).map((item) => {
      userRoles = [...userRoles, roleInfo[item]];
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      uniq_key: user.uniqKey,
      phone: user.phone,
      avatar: user.avatar
        ? `${process.env.APP_CONTENT_PATH}/avatars/users/avatars/${user.avatar}`
        : "",
      token: user.token,
      refresh_token: user.refresh_token,
      status: user.status,
      created_at: user.created_at,
      roles: userRoles,
    };
  }

  public collection(users: any[]) {
    return users.map((user) => this.transform(user));
  }

  public transformCategoryRoles(category: any) {
    return {
      id: category.id,
      title: category.title,
      key: category.key,
      permissions: this.collectionPermissionCategoryRoles(category.permissions),
    };
  }

  public collectionCategoryRoles(categories: any[]) {
    return categories.map((item) => this.transformCategoryRoles(item));
  }

  public transformPermissionCategoryRoles(permission: any) {
    return {
      id: permission.id,
      title: permission.title,
      key: permission.key,
      category_id: permission.categoryID,
    };
  }

  public collectionPermissionCategoryRoles(permissions: any[]) {
    return permissions.map((item) =>
      this.transformPermissionCategoryRoles(item)
    );
  }

  public transformUserRole(tem: any) {
    const role = tem.role;
    let userPermissions = {};

    role.permissions.map((item) => {
      const key = item.category.category.key;

      if (userPermissions[key] === undefined) {
        userPermissions[key] = {
          category: {
            id: item.category.category.id,
            title: item.category.category.title,
            key,
          },
          permissions: [
            {
              ...item.permission,
            },
          ],
        };
      } else {
        userPermissions[key] = {
          ...userPermissions[key],
          permissions: [
            ...userPermissions[key].permissions,
            {
              ...item.permission,
            },
          ],
        };
      }
    });

    const permissions = [];
    Object.keys(userPermissions).map((key) => {
      permissions.push(userPermissions[key]);
    });

    return {
      role_id: role.id,
      title: role.title,
      key: role.key,
      permissions,
    };
  }

  private collectionUserRole(roles: any[]) {
    return roles.map((item) => this.transformUserRole(item));
  }
}
