# =========================
# BUILD STAGE
# =========================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files first for Docker layer caching
COPY package*.json ./

# Install dependencies exactly as locked
RUN npm ci

# Copy the rest of the project
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Compile TypeScript -> dist/
RUN npm run build

# =========================
# RUNTIME STAGE
# =========================
FROM node:22-alpine

# Create a non-root user
RUN addgroup app && adduser -S -G app app

WORKDIR /app

# Copy only what is needed to run the application
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Give ownership to the application user
RUN chown -R app:app /app

# Run as non-root
USER app

EXPOSE 8000

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]

# RUN = executed while building the image.
# CMD = executed when the container starts.