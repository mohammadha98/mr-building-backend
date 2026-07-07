"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log("🌱 Starting database seeding...");
    console.log("📁 Creating role categories...");
    const categories = [
        { title: "Dashboard", key: "dashboard" },
        { title: "User Management", key: "user_management" },
        { title: "Content Management", key: "content_management" },
        { title: "Real Estate", key: "real_estate" },
        { title: "Settings", key: "settings" },
    ];
    const createdCategories = [];
    for (const category of categories) {
        const existingCategory = await prisma.adminUserRoleCategories.findFirst({
            where: { key: category.key },
        });
        if (!existingCategory) {
            const created = await prisma.adminUserRoleCategories.create({
                data: {
                    title: category.title,
                    key: category.key,
                    creator_id: 1,
                },
            });
            createdCategories.push(created);
            console.log(`✅ Created category: ${category.title}`);
        }
        else {
            createdCategories.push(existingCategory);
            console.log(`⏭️  Category already exists: ${category.title}`);
        }
    }
    console.log("🔐 Creating permissions...");
    const permissions = [
        {
            categoryKey: "dashboard",
            title: "View Dashboard",
            key: "view_dashboard",
        },
        {
            categoryKey: "dashboard",
            title: "Export Dashboard",
            key: "export_dashboard",
        },
        {
            categoryKey: "user_management",
            title: "Create Users",
            key: "create_users",
        },
        {
            categoryKey: "user_management",
            title: "Edit Users",
            key: "edit_users",
        },
        {
            categoryKey: "user_management",
            title: "Delete Users",
            key: "delete_users",
        },
        {
            categoryKey: "user_management",
            title: "View Users",
            key: "view_users",
        },
        {
            categoryKey: "user_management",
            title: "Manage Roles",
            key: "manage_roles",
        },
        {
            categoryKey: "content_management",
            title: "Create Content",
            key: "create_content",
        },
        {
            categoryKey: "content_management",
            title: "Edit Content",
            key: "edit_content",
        },
        {
            categoryKey: "content_management",
            title: "Delete Content",
            key: "delete_content",
        },
        {
            categoryKey: "content_management",
            title: "Publish Content",
            key: "publish_content",
        },
        {
            categoryKey: "real_estate",
            title: "View Real Estate Ads",
            key: "view_real_estate_ads",
        },
        {
            categoryKey: "real_estate",
            title: "Approve Real Estate Ads",
            key: "approve_real_estate_ads",
        },
        {
            categoryKey: "real_estate",
            title: "Reject Real Estate Ads",
            key: "reject_real_estate_ads",
        },
        {
            categoryKey: "real_estate",
            title: "Manage Categories",
            key: "manage_real_estate_categories",
        },
        {
            categoryKey: "settings",
            title: "Edit Settings",
            key: "edit_settings",
        },
        {
            categoryKey: "settings",
            title: "View Logs",
            key: "view_logs",
        },
        {
            categoryKey: "settings",
            title: "Manage System",
            key: "manage_system",
        },
    ];
    const createdPermissions = [];
    for (const permission of permissions) {
        const category = createdCategories.find((c) => c.key === permission.categoryKey);
        if (!category)
            continue;
        const existingPermission = await prisma.adminUserRoleCategoryPermissions.findFirst({
            where: { key: permission.key },
        });
        if (!existingPermission) {
            const created = await prisma.adminUserRoleCategoryPermissions.create({
                data: {
                    title: permission.title,
                    key: permission.key,
                    categoryID: category.id,
                    creator_id: 1,
                },
            });
            createdPermissions.push(created);
            console.log(`✅ Created permission: ${permission.title}`);
        }
        else {
            createdPermissions.push(existingPermission);
            console.log(`⏭️  Permission already exists: ${permission.title}`);
        }
    }
    console.log("🎯 Creating roles...");
    const roles = [
        {
            title: "Super Admin",
            key: "super_admin",
            description: "Full access to all system features",
            permissionKeys: [
                "view_dashboard",
                "export_dashboard",
                "create_users",
                "edit_users",
                "delete_users",
                "view_users",
                "manage_roles",
                "create_content",
                "edit_content",
                "delete_content",
                "publish_content",
                "view_real_estate_ads",
                "approve_real_estate_ads",
                "reject_real_estate_ads",
                "manage_real_estate_categories",
                "edit_settings",
                "view_logs",
                "manage_system",
            ],
        },
        {
            title: "Admin",
            key: "admin",
            description: "Administrative access with limited settings control",
            permissionKeys: [
                "view_dashboard",
                "export_dashboard",
                "create_users",
                "edit_users",
                "delete_users",
                "view_users",
                "create_content",
                "edit_content",
                "delete_content",
                "publish_content",
                "view_real_estate_ads",
                "approve_real_estate_ads",
                "reject_real_estate_ads",
                "manage_real_estate_categories",
                "view_logs",
            ],
        },
        {
            title: "Manager",
            key: "manager",
            description: "Manage content and approve listings",
            permissionKeys: [
                "view_dashboard",
                "create_content",
                "edit_content",
                "publish_content",
                "view_real_estate_ads",
                "approve_real_estate_ads",
                "reject_real_estate_ads",
            ],
        },
        {
            title: "Editor",
            key: "editor",
            description: "Can create and edit content",
            permissionKeys: [
                "view_dashboard",
                "create_content",
                "edit_content",
                "publish_content",
            ],
        },
        {
            title: "Viewer",
            key: "viewer",
            description: "Can only view dashboard and content",
            permissionKeys: ["view_dashboard", "view_real_estate_ads"],
        },
    ];
    const createdRoles = [];
    for (const role of roles) {
        const existingRole = await prisma.adminUserRolesProfile.findFirst({
            where: { key: role.key },
        });
        if (!existingRole) {
            const created = await prisma.adminUserRolesProfile.create({
                data: {
                    title: role.title,
                    key: role.key,
                    description: role.description,
                    creator_id: 1,
                },
            });
            createdRoles.push(created);
            console.log(`✅ Created role: ${role.title}`);
            for (const category of createdCategories) {
                const categoryAssignment = await prisma.adminUserRolesProfileCategories.create({
                    data: {
                        categoryID: category.id,
                        roleID: created.id,
                        creator_id: 1,
                    },
                });
                const rolePermissions = role.permissionKeys
                    .map((key) => createdPermissions.find((p) => p.key === key))
                    .filter((p) => p && createdCategories.find((c) => c.id === p.categoryID));
                for (const permission of rolePermissions) {
                    if (permission && permission.categoryID === category.id) {
                        await prisma.adminUserRolesProfileCategoryPermisions.create({
                            data: {
                                categoryID: categoryAssignment.id,
                                permissionID: permission.id,
                                roleID: created.id,
                                creator_id: 1,
                            },
                        });
                    }
                }
            }
        }
        else {
            createdRoles.push(existingRole);
            console.log(`⏭️  Role already exists: ${role.title}`);
        }
    }
    console.log("👥 Creating admin users...");
    const adminUsers = [
        {
            name: "Super Admin",
            email: "superadmin@mrbuilding.local",
            phone: "989999999999",
            password: "SuperAdmin@123",
            roleKey: "super_admin",
        },
        {
            name: "Admin User",
            email: "admin@mrbuilding.local",
            phone: "989999999998",
            password: "Admin@123",
            roleKey: "admin",
        },
        {
            name: "Manager User",
            email: "manager@mrbuilding.local",
            phone: "989999999997",
            password: "Manager@123",
            roleKey: "manager",
        },
        {
            name: "Editor User",
            email: "editor@mrbuilding.local",
            phone: "989999999996",
            password: "Editor@123",
            roleKey: "editor",
        },
        {
            name: "Viewer User",
            email: "viewer@mrbuilding.local",
            phone: "989999999995",
            password: "Viewer@123",
            roleKey: "viewer",
        },
    ];
    for (const userData of adminUsers) {
        const existingUser = await prisma.users.findFirst({
            where: { email: userData.email },
        });
        if (!existingUser) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(userData.password, salt);
            const user = await prisma.users.create({
                data: {
                    name: userData.name,
                    email: userData.email,
                    phone: userData.phone,
                    password: hashedPassword,
                    uniqKey: `user_${Date.now()}_${Math.random()
                        .toString(36)
                        .substr(2, 9)}`,
                    creator_id: 1,
                },
            });
            const roleProfile = createdRoles.find((r) => r.key === userData.roleKey);
            if (roleProfile) {
                await prisma.adminUserRoles.create({
                    data: {
                        userID: user.id,
                        roleID: roleProfile.id,
                    },
                });
                console.log(`✅ Created user: ${userData.email} with role: ${userData.roleKey}`);
            }
        }
        else {
            console.log(`⏭️  User already exists: ${userData.email}`);
        }
    }
    console.log("✨ Database seeding completed successfully!");
    console.log("\n📝 Test Credentials:");
    console.log("━".repeat(50));
    for (const user of adminUsers) {
        console.log(`Email: ${user.email} | Password: ${user.password} | Role: ${user.roleKey}`);
    }
    console.log("━".repeat(50));
}
main()
    .catch((e) => {
    console.error("🔴 Error during seed:", e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map