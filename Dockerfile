FROM node:lts-alpine AS build0

COPY . /tetris/

WORKDIR /tetris

RUN npm config set registry https://repo.huaweicloud.com/repository/npm/ && \
    npm cache clean -f && \
    npm install  && \
    npm run build


FROM nginx:alpine

COPY --from=build0 /tetris/docs /usr/share/nginx/html
