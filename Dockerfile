FROM node:10-alpine AS builder

COPY . /app

WORKDIR /app

RUN npm install && npm run build

FROM nginx:alpine

COPY --from=builder /app/docs /usr/share/nginx/html
