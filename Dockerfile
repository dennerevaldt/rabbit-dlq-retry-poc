FROM node:12.16.3-alpine

RUN mkdir -p /usr/src/app/

WORKDIR /usr/src/app/

COPY . .

RUN npm install

CMD npm start