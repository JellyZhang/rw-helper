FROM node:10-alpine as builder

ENV PATH $PATH:/usr/lib/node_modules/bin

RUN mkdir /app

WORKDIR /app

COPY ./src ./src
COPY ./config ./config
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
COPY ./tsconfig.json ./tsconfig.json

RUN npm config set registry http://registry.npm.taobao.org

RUN npm install

RUN npm install typescript@4.1.3 -g

RUN tsc

FROM node:10-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/config ./config
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

ENTRYPOINT ["node", "./dist/src/main.js"]
