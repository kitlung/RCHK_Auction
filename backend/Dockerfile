    FROM node:10.15.1-alpine

    WORKDIR /rchk_auction/backend/

    COPY package*.json /rchk_auction/backend/

    RUN npm install

    COPY . .

    EXPOSE 7082

    CMD npm start
