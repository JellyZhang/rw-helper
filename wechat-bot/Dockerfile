FROM node:10-alpine as builder

ENV PATH $PATH:/usr/lib/node_modules/bin

RUN mkdir /app

WORKDIR /app

ADD ./src ./src
ADD ./config ./config
ADD ./package.json ./package.json
ADD ./package-lock.json ./package-lock.json
ADD ./tsconfig.json ./tsconfig.json

RUN npm config set registry http://registry.npm.taobao.org

RUN npm install --loglevel verbose

RUN npm install typescript -g --loglevel verbose

RUN tsc

FROM node:10-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/config ./config
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

ENTRYPOINT ["node", "./dist/src/main.js"]
