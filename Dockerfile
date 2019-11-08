FROM node as build

WORKDIR /r6-app/

ADD package.json ./package.json
ADD yarn.lock ./yarn.lock

RUN yarn

ADD . .

RUN yarn build