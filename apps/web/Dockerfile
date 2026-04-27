FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json

RUN npm install

COPY . .

WORKDIR /app/apps/web

RUN npm run build

FROM nginx:1.27-alpine

COPY --from=builder /app/apps/web/dist/web/browser /usr/share/nginx/html

EXPOSE 80
