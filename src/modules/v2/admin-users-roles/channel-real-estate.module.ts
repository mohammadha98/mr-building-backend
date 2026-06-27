import { Module } from "@nestjs/common";
import { AdminUsersRolesPrivateModule } from "./private/admin-users-roles.module";
import { AdminUsersRolesPublicModule } from "./public/admin-users-roles.module";

@Module({
  imports: [AdminUsersRolesPrivateModule, AdminUsersRolesPublicModule],
})
export class AdminUsersRolesModule {}
