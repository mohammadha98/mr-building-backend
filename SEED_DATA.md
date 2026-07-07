# Database Seeding & Test Users

This document explains how to seed the database with test data and use the mock admin users for testing and development.

## Overview

The seed script creates:
- **5 role categories** (Dashboard, User Management, Content Management, Real Estate, Settings)
- **17 permissions** across all categories
- **5 roles** with different permission levels (Super Admin, Admin, Manager, Editor, Viewer)
- **5 test admin users** with different role assignments

## How to Run the Seed Script

### Option 1: Using npm/yarn (Recommended)

```bash
npm run db:seed
# or
yarn db:seed
```

### Option 2: Using ts-node directly

```bash
npm run prisma:seed
# or
npx ts-node prisma/seed.ts
```

### Option 3: Using Prisma CLI

```bash
npx prisma db seed
```

## Test Users

The following test users are created with their respective roles and permissions:

### 1. Super Admin (Full Access)
- **Email:** `superadmin@mrbuilding.local`
- **Password:** `SuperAdmin@123`
- **Phone:** `989999999999`
- **Permissions:** All system permissions
- **Access:** Full system access including user/role management and settings

### 2. Admin (Administrative Access)
- **Email:** `admin@mrbuilding.local`
- **Password:** `Admin@123`
- **Phone:** `989999999998`
- **Permissions:** User management, content management, real estate approval, dashboard and logs
- **Access:** Can manage most system features except system settings

### 3. Manager (Content & Real Estate Management)
- **Email:** `manager@mrbuilding.local`
- **Password:** `Manager@123`
- **Phone:** `989999999997`
- **Permissions:** View dashboard, manage content, view/approve/reject real estate ads
- **Access:** Can manage and approve content and listings

### 4. Editor (Content Creation)
- **Email:** `editor@mrbuilding.local`
- **Password:** `Editor@123`
- **Phone:** `989999999996`
- **Permissions:** View dashboard, create/edit/publish content
- **Access:** Can create and manage content

### 5. Viewer (View Only)
- **Email:** `viewer@mrbuilding.local`
- **Password:** `Viewer@123`
- **Phone:** `989999999995`
- **Permissions:** View dashboard and real estate ads
- **Access:** Read-only access to dashboards and listings

## Permissions Matrix

### Dashboard Category
- ✅ View Dashboard
- ✅ Export Dashboard

### User Management Category
- ✅ Create Users
- ✅ Edit Users
- ✅ Delete Users
- ✅ View Users
- ✅ Manage Roles

### Content Management Category
- ✅ Create Content
- ✅ Edit Content
- ✅ Delete Content
- ✅ Publish Content

### Real Estate Category
- ✅ View Real Estate Ads
- ✅ Approve Real Estate Ads
- ✅ Reject Real Estate Ads
- ✅ Manage Categories

### Settings Category
- ✅ Edit Settings
- ✅ View Logs
- ✅ Manage System

## Role Permissions Breakdown

### Super Admin
- **All 17 permissions**
- Can manage the entire system
- Can create, edit, delete users and roles

### Admin
- 15 permissions (excludes settings management)
- Cannot manage system settings
- Cannot manage system core features

### Manager
- 6 permissions
- Can approve/reject real estate listings
- Can manage content creation
- Can view dashboard

### Editor
- 4 permissions
- Can create and publish content
- Can view dashboard
- Limited to content operations only

### Viewer
- 2 permissions
- Can only view dashboard and listings
- Read-only access

## Usage Example

### Login with Super Admin

```bash
curl -X POST http://localhost:3000/api/v2/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@mrbuilding.local",
    "password": "SuperAdmin@123"
  }'
```

### Access Protected API with Token

```bash
curl -X GET http://localhost:3000/api/v2/admin/users \
  -H "Authorization: Bearer <your_jwt_token>"
```

## Re-seeding Database

If you need to reset and re-seed:

```bash
# Reset the database (deletes all data)
npx prisma migrate reset

# Or just re-run the seed
npm run db:seed
```

⚠️ **Warning:** Using `prisma migrate reset` will delete all data in the database!

## Important Notes

1. **Passwords** are hashed using bcryptjs before storage
2. **Unique Key** is generated automatically for each user
3. **Creator ID** is set to 1 for all seeded data
4. All users have status: `active`
5. The seed script is **idempotent** - running it multiple times won't create duplicates
6. Users are checked by email before creation to prevent duplicates

## Troubleshooting

### Script fails with "module not found"

Make sure `bcryptjs` is installed:
```bash
npm install bcryptjs
```

### Database connection error

Ensure your `.env` file has the correct `DATABASE_URL`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/mr_building"
```

### Seed script times out

Increase the timeout by running with environment variables:
```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run db:seed
```

## Next Steps

1. Run `npm run db:seed` to populate the database
2. Start the backend: `npm run start:dev`
3. Login using one of the test accounts above
4. Use the JWT token returned to access protected APIs
5. Start building and testing your features!

## Support

For more details on permissions and role management, refer to:
- [Admin Users Roles Module](/src/modules/v2/admin-users-roles)
- [Prisma Schema](/prisma/schema.prisma)
