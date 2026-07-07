# Quick Start Guide - Test Users & Seeding

## 🚀 Quick Setup

### Step 1: Ensure Dependencies are Installed
```bash
npm install
# or
yarn install
```

### Step 2: Run Database Migrations
```bash
npx prisma migrate deploy
# or if you want to create/push all changes
npx prisma db push
```

### Step 3: Seed the Database with Test Data
Choose one of the following methods:

#### Method 1: Using NPM Script (Recommended)
```bash
npm run db:seed
```

#### Method 2: Using ts-node
```bash
npm run prisma:seed
```

#### Method 3: Using API Endpoint (After app is running)
```bash
curl -X POST http://localhost:3000/v2/admin/seed/initialize \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json"
```

---

## 👥 Test User Credentials

Once seeding is complete, use these credentials to login:

### 1️⃣ Super Admin (Full System Access)
```bash
Email:    superadmin@mrbuilding.local
Password: SuperAdmin@123
Role:     super_admin
Access:   ✅ All features, user management, settings
```

### 2️⃣ Admin (Administrative Access)
```bash
Email:    admin@mrbuilding.local
Password: Admin@123
Role:     admin
Access:   ✅ Most features except system settings
```

### 3️⃣ Manager (Content & Real Estate Management)
```bash
Email:    manager@mrbuilding.local
Password: Manager@123
Role:     manager
Access:   ✅ Dashboard, content management, approve/reject ads
```

### 4️⃣ Editor (Content Creation)
```bash
Email:    editor@mrbuilding.local
Password: Editor@123
Role:     editor
Access:   ✅ Create and publish content only
```

### 5️⃣ Viewer (Read-Only Access)
```bash
Email:    viewer@mrbuilding.local
Password: Viewer@123
Role:     viewer
Access:   ✅ View dashboard and listings only
```

---

## 🔑 Getting JWT Tokens

### Login and Get Token
```bash
curl -X POST http://localhost:3000/api/v2/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@mrbuilding.local",
    "password": "SuperAdmin@123"
  }'
```

**Response Example:**
```json
{
  "status": 200,
  "data": {
    "id": 1,
    "name": "Super Admin",
    "email": "superadmin@mrbuilding.local",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "roles": ["super_admin"]
  }
}
```

### Use Token for Protected Routes
```bash
curl -X GET http://localhost:3000/api/v2/admin/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## 📊 What Gets Created

The seed script automatically creates:

✅ **5 Role Categories**
- Dashboard
- User Management
- Content Management
- Real Estate
- Settings

✅ **17 Permissions**
- View/Export Dashboard
- Create/Edit/Delete/Publish Users and Content
- Manage Real Estate Ads
- View Logs
- And more...

✅ **5 Roles with Permissions**
- Super Admin: All permissions
- Admin: 15 permissions
- Manager: 6 permissions
- Editor: 4 permissions
- Viewer: 2 permissions

✅ **5 Test Admin Users**
- All with different role levels
- Password hashed with bcryptjs
- Ready for immediate testing

---

## 🧪 Testing APIs with Test Users

### Example 1: Get All Users (Super Admin)
```bash
# Login
TOKEN=$(curl -s -X POST http://localhost:3000/api/v2/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@mrbuilding.local","password":"SuperAdmin@123"}' | jq -r '.data.token')

# Get users
curl -X GET http://localhost:3000/api/v2/admin/users \
  -H "Authorization: Bearer $TOKEN"
```

### Example 2: Create New User (Admin Only)
```bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/v2/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mrbuilding.local","password":"Admin@123"}' | jq -r '.data.token')

curl -X POST http://localhost:3000/api/v2/admin/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Admin",
    "email": "newadmin@mrbuilding.local",
    "password": "NewPass@123",
    "roleId": "role_uuid_here"
  }'
```

### Example 3: View Only (Viewer Role)
```bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/v2/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"viewer@mrbuilding.local","password":"Viewer@123"}' | jq -r '.data.token')

# This should work (viewer can view)
curl -X GET http://localhost:3000/api/v2/admin/dashboard \
  -H "Authorization: Bearer $TOKEN"

# This should fail with 403 Forbidden (viewer cannot edit)
curl -X POST http://localhost:3000/api/v2/admin/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test"}'
```

---

## ⚙️ Environment Setup

Make sure your `.env` file is configured:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mr_building_db"

# JWT
JWT_SECRET_KEY="your_secret_key_here"
JWT_EXPIRATION="24h"

# Server
PORT=3000
NODE_ENV=development
```

---

## 🔄 Re-seeding Database

If you need to reset and re-seed:

```bash
# Option 1: Soft reset (only drops public schema, keeps databases)
npx prisma migrate reset

# Option 2: Manual approach
npx prisma db push --force-reset
npm run db:seed
```

⚠️ **Warning:** These commands delete all data!

---

## 🆘 Troubleshooting

### Error: "Connection refused"
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env

### Error: "js-is-not-defined"
- Run `npm install bcryptjs`

### Error: "Duplicate key value violates unique constraint"
- Run: `npm run db:seed` (it checks for existing records)

### Users not showing after seeding
- Check database connection: `npx prisma studio`
- Verify seed ran successfully

### JWT token invalid
- Ensure JWT_SECRET_KEY matches in .env
- Check token expiration

---

## 📚 Additional Resources

- [Full Seeding Documentation](./SEED_DATA.md)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [NestJS JWT Guide](https://docs.nestjs.com/recipes/passport)
- [Admin Roles Module](./src/modules/v2/admin-users-roles/)

---

## ✨ Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Run migrations: `npx prisma db push`
3. ✅ Seed database: `npm run db:seed`
4. ✅ Start server: `npm run start:dev`
5. ✅ Login with test credentials
6. ✅ Start developing!

Happy coding! 🎉
