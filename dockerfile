FROM node:18-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package*.json ./
COPY prisma ./prisma

# Install ALL dependencies (including dev)
RUN npm ci

# Copy source
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build (nest CLI is available here)
RUN npm run build

# ---- Production Stage ----
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma

# Install ONLY production dependencies
RUN npm ci --only=production

# Generate Prisma Client for production
RUN npx prisma generate

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Start
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/src/main.js"]
