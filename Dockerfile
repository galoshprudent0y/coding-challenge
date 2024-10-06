# Build stage
FROM node:18-alpine AS builder
WORKDIR /usr/src/app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY tsconfig*.json ./
COPY src ./src
COPY openapi-spec.yaml ./
RUN pnpm run build

# Production stage
FROM node:18-alpine
WORKDIR /usr/src/app
RUN npm install -g pnpm
# Set JWT_SECRET environment variable
ENV JWT_SECRET=mysecretkey
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/openapi-spec.yaml ./
# Create a non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001
USER nestjs
# Expose the port the app runs on
EXPOSE 3000
# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1
# Start the application
CMD ["node", "dist/infrastructure/nestjs/main.js"]
