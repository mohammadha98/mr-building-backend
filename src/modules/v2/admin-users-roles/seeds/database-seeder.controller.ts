import { Controller, Post, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { DatabaseSeederService } from "../seeds/database-seeder.service";

@ApiTags("Admin - Database Seeding")
@Controller("v2/admin/seed")
@ApiBearerAuth()
export class DatabaseSeederController {
  constructor(private readonly seederService: DatabaseSeederService) {}

  @Post("initialize")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Initialize database with seed data",
    description:
      "Seeds the database with test roles, permissions, and admin users. This can be run after migrations.",
  })
  @ApiResponse({
    status: 200,
    description: "Database seeding completed successfully",
    schema: {
      example: {
        success: true,
        message: "Database seeding completed successfully",
        data: {
          categoriesCreated: 5,
          permissionsCreated: 17,
          rolesCreated: 5,
          usersCreated: 5,
          users: [
            {
              id: 1,
              name: "Super Admin",
              email: "superadmin@mrbuilding.local",
              phone: "989999999999",
              role: "super_admin",
              password: "SuperAdmin@123",
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: "Seeding failed",
  })
  async initializeDatabase() {
    return this.seederService.seedDatabase();
  }
}
