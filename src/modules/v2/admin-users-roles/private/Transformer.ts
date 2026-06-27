import { Injectable } from "@nestjs/common";

@Injectable()
export default class adminUserRolesTransformer {
  public transformCategoryRoles(category: any) {
    console.log({ category });

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
}
