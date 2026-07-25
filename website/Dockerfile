# =========================
# BUILD STAGE
# =========================

FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./

RUN npm ci

COPY . . 

RUN npm run build


# =========================
# RUNTIME STAGE
# =========================

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port on server
EXPOSE 80
