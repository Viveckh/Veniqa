FROM mhart/alpine-node:8

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY . /app/

CMD [ "npm", "run", "devstart" ]