FROM mhart/alpine-node:8

WORKDIR /app

COPY package*.json /app/

RUN npm install

RUN npm run build

COPY . /app/

EXPOSE 3000

CMD [ "npm", "start" ]