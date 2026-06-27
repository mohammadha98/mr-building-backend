FROM node:18-alpine

WORKDIR /app

# Copy dependency files
COPY package*.json ./
COPY prisma ./prisma

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build
RUN npm run build

# Cleanup dev dependencies
RUN npm prune --production

# Start
ENV NODE_ENV=production
CMD ["node", "dist/src/main.js"]
