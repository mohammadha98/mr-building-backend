import { Injectable } from "@nestjs/common";

@Injectable()
export default class adminUserRolesTransformer {
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

  public transformRole(role: any) {
    let categories = {};

    role.category.map((item) => {
      const category = item.category;
      if (categories[category.key] === undefined) {
        categories[category.key] = {
          cat_id: category.id,
          cat_title: category.title,
          cat_key: category.key,
          permissions: [],
        };
      } else {
        categories[category.key] = {
          ...categories[category.key],
        };
      }
    });

    role.permissions.map((item) => {
      let permissions = item.permission;
      let category = item.permission.category;

      if (categories[category.key] !== undefined) {
        categories[category.key].permissions = [
          ...categories[category.key].permissions,
          {
            id: permissions.id,
            title: permissions.title,
            key: permissions.key,
          },
        ];
      }
    });

    const presentedCategories = [];
    Object.keys(categories).map((item) => {
      presentedCategories.push(categories[item]);
    });

    return {
      id: role.id,
      title: role.title,
      description: role.description,
      key: role.key,
      categories: presentedCategories,
    };
  }

  public collectionRoles(categories: any[]) {
    return categories.map((item) => this.transformRole(item));
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
}
