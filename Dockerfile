###
FROM node:10.16.3-alpine as development
RUN apk add --no-cache less bash


###
FROM node:10.16.3-alpine as production

ENV NODE_ENV=production
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install
COPY src ./src

CMD ["node", "src/server.js"]
