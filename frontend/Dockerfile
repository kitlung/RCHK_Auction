# check version in docker hub

FROM node:10.15.1-alpine

WORKDIR /rchk_auction/frontend/

COPY package*.json /rchk_auction/frontend/

RUN npm install

COPY . .

RUN npm run build


EXPOSE 8080